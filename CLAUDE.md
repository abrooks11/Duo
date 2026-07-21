# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duo is a full-stack healthcare data integration platform for small to mid-size facilities. It ingests Excel/CSV exports and syncs data from EHR systems (Tebra/Kareo) into a PostgreSQL database via Prisma, and presents the data through filterable tables. Features include AI-powered reporting, SMS messaging via RingRX, voicemail management, and Tebra appointment/patient/EOB sync.

## Development Commands

```bash
npm run start         # Start both frontend (port 5173) and backend (port 3000) concurrently
npm run dev           # Frontend only (Vite dev server)
npm run server        # Backend only (nodemon with tsx, watches src/server)
npm run build         # TypeScript compile + Vite build
npm run lint          # ESLint
npm run format        # Prettier write
npm run format:check  # Prettier check
```

**Database:**
```bash
npx prisma migrate dev    # Apply or create migrations
npx prisma studio         # Open Prisma GUI
npx prisma generate       # Regenerate Prisma client
```

## Architecture

### Stack
- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS v4, Material-UI (MUI X DataGrid for tables), React Router v7
- **Backend:** Express.js (ESM), Prisma ORM, PostgreSQL
- **State:** React Context + `useReducer` + Immer (Redux-like pattern in `src/client/context/`)
- **File Ingestion:** `xlsx` library parses Excel/CSV uploads; Multer handles multipart
- **EHR Integration:** Tebra (Kareo) SOAP API sync for appointments, patients, and EOBs (`fast-xml-parser`)
- **AI:** OpenAI for natural-language SQL report generation and voicemail features
- **Validation:** Zod for input validation
- **Path Alias:** `@client` resolves to `./src/client` (configured in `vite.config.ts` and `tsconfig.app.json`)

### Key Architectural Patterns

**Frontend (`src/client/`):**
- Global state lives in `context/` — uses Immer for immutable updates
- Active reducers: `appointmentReducer`, `voicemailReducer`, `reportReducer` (wired in `index.reducer.ts`); `patientReducer` exists but is not yet wired into the root reducer
- Separate SMS form context in `context/shared/smsFormcontext.tsx` (standalone React context, not part of global `useReducer`)
- Custom hooks in `hooks/`: `useApi` (API client), `useGlobalContext` (context accessor), `useDateRangeFilter` (table date filtering), `useStateMap` (maps URL path to state key)
- Feature-specific services in `features/*/services/` (e.g., `appointments/services/appointmentApi.ts`, `payments/services/paymentApi.ts`, `voicemail/services/voicemailApi.ts`)
- Frontend features: `appointments/`, `payments/`, `reports/`, `sms/`, `voicemail/`
- Pages: `Home`, `Appointments`, `Claims`, `Patients`, `Payments`, `Reports`, `Voicemail`, `Demo`
- Components organized into: `components/layout/`, `components/sidebar/`, `components/tables/`, `components/ui/`
- Vite proxies `/api` requests to `http://localhost:3000`, so frontend fetches use relative `/api/...` paths

**Backend (`src/server/`):**
- **Domain-based organization** under `src/server/domains/` — each domain has Router, Controller, Services, Types files
- Domains: `auth/`, `ai/`, `appointments/`, `claims/`, `patients/`, `payments/`, `voicemail/`, `upload/`, `reports/`, `sms/`, `tebra-api/`, `estimates/`
- `routes/api.ts` mounts all domain routers under `/api`
- `domains/upload/fieldMap.ts` maps Excel column headers to Prisma field names — critical for upload processing
- `domains/upload/excelServices.ts` handles Excel serial date → ISO string conversion
- `shared/logger.ts` provides structured logging (`createChildLogger`); `shared/errorHandlers.ts` exports `AppError`, `sendSuccess`, `sendError`, `handleControllerError`, `asyncHandler`
- Upload endpoint: `POST /api/upload/:resourceType/:sheetName` — supports `patient`, `appointment`, `deposit`, `eob`. All upsert logic is inline in `uploadRouter.ts` (no separate controller files). `uploadTypes.ts` defines the `ExcelRow` interface
- **RingRX auth** (`domains/auth/`): `authUtils.ts` handles token refresh logic; `authMiddleware.ts` exports `ensureRingAuth` Express middleware. Cookie-based token management with auto-refresh on 401/403
- **Tebra sync** (`domains/tebra-api/`): SOAP API client; `tebraSync.ts` exports `syncAppointments`, `syncEobs`, and `syncPatients`; `tebraApi.ts` exports individual fetch functions. Shared Prisma instance from `src/server/prisma.ts`
- **Patient sync**: `POST /api/patients/sync` triggers `syncPatients` from Tebra
- **Reports** (`domains/reports/`): AI generates SQL from natural language descriptions; `sqlValidator.ts` ensures SELECT-only queries. See `src/client/features/reports/CLAUDE_REPORTS.md` for detailed reports guidance
- **SMS** (`domains/sms/`): sends messages via RingRX API

**Database (`prisma/schema.prisma`):**
- Core models: `Patient`, `Appointment`, `Charge`, `Voicemail`, `Payment`, `PatientVoicemail` (junction), `Report`, `ReportFolder`, `Eob`, `Deposit`
- `PatientVoicemail` is a many-to-many join between Patient and Voicemail
- `Charge` has explicit foreign keys to `Patient` and `Appointment` with indexes
- Monetary fields use `Decimal` (Prisma default precision)
- `Payment` model: `id String @id`, `reference String @unique`, `payerName`, `amount Decimal`, `isPaid Boolean @default(false)`
- `Eob` model: has `isMatched Boolean @default(false)` and `isProcessed Boolean @default(false)` flags; relates to `Deposit` via optional `depositId`
- Voicemail uses enums: `CallerType` (patient, other, clinic, pharmacy, insurance) and `VoicemailReason` (appointment, prescription, referral, etc.)
- `relationJoins` preview feature is enabled

### Environment Variables (`.env`)
```
DATABASE_URL=postgresql://username:password@localhost:5432/duo
PORT=3000
NODE_ENV=development

# OpenAI (reports AI, voicemail features)
OPENAI_API_KEY=

# RingRX (voicemail, SMS)
RING_USER_NAME=
RING_PASSWORD=
RINGRX_BASE_URL=https://portal.ringrx.com

# Tebra/Kareo (EHR sync)
TEBRA_API_URL=
TEBRA_CUSTOMER_KEY=
TEBRA_USER_ID=
TEBRA_PASSWORD=
TEBRA_PRACTICE_NAME=
```

## Key File Locations

| Purpose | Path |
|---------|------|
| Express server entry | `src/server/server.js` |
| API router mount | `src/server/routes/api.ts` |
| Backend domains | `src/server/domains/` |
| Excel column → Prisma field map | `src/server/domains/upload/fieldMap.ts` |
| Upload types | `src/server/domains/upload/uploadTypes.ts` |
| Structured logger | `src/server/shared/logger.ts` |
| Error handlers & response envelope | `src/server/shared/errorHandlers.ts` |
| Upload domain | `src/server/domains/upload/` |
| Tebra integration | `src/server/domains/tebra-api/` |
| Tebra SOAP field/filter templates | `SOAP-header-templates/` |
| Tebra SOAP API rule | `.claude/rules/tebra-soap-api.md` |
| Reports (AI SQL) | `src/server/domains/reports/` |
| Reports domain guide | `src/client/features/reports/CLAUDE_REPORTS.md` |
| RingRX auth | `src/server/domains/auth/` |
| SMS feature | `src/server/domains/sms/` |
| Prisma schema | `prisma/schema.prisma` |
| React entry | `src/client/main.tsx` |
| Global state context | `src/client/context/` |
| SMS form context | `src/client/context/shared/smsFormcontext.tsx` |
| Reports frontend | `src/client/features/reports/` |
| Payments frontend | `src/client/features/payments/` |
| Payment API client service | `src/client/features/payments/services/paymentApi.ts` |
| Shared Prisma instance | `src/server/prisma.ts` |
| Vite config (proxy + alias) | `vite.config.ts` |

## Notes

- The backend runs as ESM (`"type": "module"` in package.json); use `import`/`export`, not `require`/`module.exports` in server files
- Use `@client/...` import alias for client-side imports (e.g., `import { foo } from '@client/features/sms/services/smsApi'`)
- Appointments query defaults to current month + next month date range; Tebra auto-syncs on GET
- **Payment reconciliation** (`domains/payments/`): 4 endpoints — `GET /reconciliation` (auto-syncs EOBs from Tebra then returns matched/missingEob/pendingPayment rows + stats), `POST /match` (EFT reference matching), `POST /confirm` (marks Check/CC EOB as processed), `POST /clear` (requires `CLEAR_TABLES_CONFIRMED` code). Bank deposit uploads go through the upload domain, not payments.
- Tebra SOAP API conventions and pitfalls are documented in `.claude/rules/tebra-soap-api.md`; field/filter templates are in `SOAP-header-templates/`
- Voicemail integrates with RingRX API; the `openAiController` handles AI-assisted features
- Timezone adjustment of +2 hours is applied to appointment dates during upload processing
- Deposit upload processing: splits HCCLAIMPMT reference on `'*'` to extract the 3rd segment as reference number; stores `postDate` (bank posting date from statement) and `description` separately from `createdDate` (server record creation); rows with no parseable reference are filtered out before upsert
- Tebra sync preserves custom fields (notes, insEligibility, patientCopay) on updates; seeds notes from Tebra on creation
- Appointment `updateCopay` uses Zod schema validation; Prisma P2025 "not found" errors return 404. The `deleteAll` endpoint is gated to `NODE_ENV !== 'production'`
- Reports SQL validator blocks all non-SELECT statements to prevent destructive queries
- RingRX auth uses httpOnly cookies with auto-refresh; all RingRX API calls go through authenticated helpers
