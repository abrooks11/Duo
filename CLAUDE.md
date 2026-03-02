# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duo is a full-stack healthcare data integration platform for small to mid-size facilities. It ingests Excel/CSV exports and syncs data from EHR systems (Tebra/Kareo) into a PostgreSQL database via Prisma, and presents the data through filterable tables. Features include AI-powered reporting, SMS messaging via RingRX, voicemail management, and Tebra appointment sync.

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
- **EHR Integration:** Tebra (Kareo) SOAP API sync for appointments and payments (`fast-xml-parser`)
- **AI:** OpenAI for natural-language SQL report generation and voicemail features
- **Validation:** Zod for input validation

### Key Architectural Patterns

**Frontend (`src/client/`):**
- Global state lives in `context/` — uses Immer for immutable updates
- Custom hooks in `hooks/` wrap API calls (`useApi`) and context access (`useGlobalContext`)
- Resource-specific API utilities in `utils/` (e.g., `appointmentApi.ts`, `voicemailApi.ts`); feature-specific services in `features/*/services/` (e.g., `payments/services/paymentApi.ts`)
- Vite proxies `/api` requests to `http://localhost:3000`, so frontend fetches use relative `/api/...` paths

**Backend (`src/server/`):**
- **Domain-based organization** under `src/server/domains/` — each domain has Router, Controller, Services, Types files
- Domains: `auth/`, `ai/`, `appointments/`, `claims/`, `patients/`, `payments/`, `voicemail/`, `upload/`, `reports/`, `sms/`, `tebra-api/`, `estimates/`
- `routes/api.js` mounts all domain routers under `/api`
- `services/fieldMap.js` maps Excel column headers to Prisma field names — critical for upload processing
- `services/excelServices.js` handles Excel serial date → ISO string conversion
- Upload endpoint: `POST /api/upload/:resourceType/:sheetName` — supports `patient`, `appointment`, `payment`, `eob`
- Upsert logic in upload controllers: skips records if incoming `lastModifiedDate` is not newer than existing
- **RingRX auth middleware** (`domains/auth/`): cookie-based token management with auto-refresh on 401/403
- **Tebra sync** (`domains/tebra-api/`): SOAP API client; `tebraSync.ts` exports `syncAppointments` and `syncEobs`; `tebraApi.ts` exports individual fetch functions. Shared Prisma instance from `src/server/prisma.ts`
- **Reports** (`domains/reports/`): AI generates SQL from natural language descriptions, SQL validator ensures SELECT-only queries
- **SMS** (`domains/sms/`): sends messages via RingRX API

**Database (`prisma/schema.prisma`):**
- Core models: `Patient`, `Appointment`, `Charge`, `Voicemail`, `Payment`, `PatientVoicemail` (junction), `Report`, `ReportFolder`, `Eob`, `Deposit`
- `PatientVoicemail` is a many-to-many join between Patient and Voicemail
- `Charge` has explicit foreign keys to `Patient` and `Appointment` with indexes
- Monetary fields use `Decimal(65,30)` (not Float)
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
| API router mount | `src/server/routes/api.js` |
| Backend domains | `src/server/domains/` |
| Excel column → Prisma field map | `src/server/services/fieldMap.js` |
| Upload domain | `src/server/domains/upload/` |
| Tebra integration | `src/server/domains/tebra-api/` |
| Reports (AI SQL) | `src/server/domains/reports/` |
| RingRX auth middleware | `src/server/domains/auth/` |
| SMS feature | `src/server/domains/sms/` |
| Prisma schema | `prisma/schema.prisma` |
| React entry | `src/client/main.tsx` |
| Global state context | `src/client/context/` |
| Reports frontend | `src/client/features/reports/` |
| Payments frontend | `src/client/features/payments/` |
| Payment API client service | `src/client/features/payments/services/paymentApi.ts` |
| Shared Prisma instance | `src/server/prisma.ts` |
| Vite config (proxy setup) | `vite.config.ts` |

## Notes

- The backend runs as ESM (`"type": "module"` in package.json); use `import`/`export`, not `require`/`module.exports` in server files
- Appointments query defaults to current month + next month date range; Tebra auto-syncs on GET
- **Payment reconciliation** (`domains/payments/`): 3 endpoints only — `GET /reconciliation` (auto-syncs EOBs from Tebra then returns matched/missingEob/pendingPayment rows + stats), `POST /match` (EFT reference matching), `POST /clear` (requires `CLEAR_TABLES_CONFIRMED` code). Bank deposit uploads go through the upload domain, not payments.
- Tebra EOB sync (`syncEobs`): fetches Insurance payments only via `GetPayments` SOAP call. The `PayerType` filter works; do NOT use the `Amount` numeric filter (it silently blocks all results). Zero-amount records are filtered in code. Tebra returns a single empty placeholder `PaymentData` when no results match — filter these out by checking `ID !== ''`.
- Voicemail integrates with RingRX API; the `openAiController` handles AI-assisted features
- Timezone adjustment of +2 hours is applied to appointment dates during upload processing
- Deposit upload processing: splits HCCLAIMPMT reference on `'*'` to extract the 3rd segment as reference number; stores `postDate` (bank posting date from statement) and `description` separately from `createdDate` (server record creation); rows with no parseable reference are filtered out before upsert
- Tebra sync preserves custom fields (notes, insEligibility, patientCopay) on updates; seeds notes from Tebra on creation
- Appointment `updateCopay` uses Zod schema validation; Prisma P2025 "not found" errors return 404. The `deleteAll` endpoint is gated to `NODE_ENV !== 'production'`
- Reports SQL validator blocks all non-SELECT statements to prevent destructive queries
- RingRX auth uses httpOnly cookies with auto-refresh; all RingRX API calls go through authenticated helpers
