# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duo is a full-stack healthcare data integration platform for small to mid-size facilities. It ingests Excel/CSV exports from healthcare systems (appointments, patients, payments, voicemails) into a PostgreSQL database via Prisma, and presents the data through filterable tables.

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

### Key Architectural Patterns

**Frontend (`src/client/`):**
- Global state lives in `context/` — uses Immer for immutable updates
- Custom hooks in `hooks/` wrap API calls (`useApi`) and context access (`useGlobalContext`)
- Resource-specific API utilities in `utils/` (e.g., `appointmentApi.ts`, `voicemailApi.ts`)
- Vite proxies `/api` requests to `http://localhost:3000`, so frontend fetches use relative `/api/...` paths

**Backend (`src/server/`):**
- Router → Controller → Service layering
- `routes/api.js` mounts all sub-routers under `/api`
- `services/fieldMap.js` maps Excel column headers to Prisma field names — critical for upload processing
- `services/excelServices.js` handles Excel serial date → ISO string conversion
- Upload endpoint: `POST /api/upload/:resourceType/:sheetName` — supports `patient`, `appointment`, `payment`, `eob`
- Upsert logic in upload controllers: skips records if incoming `lastModifiedDate` is not newer than existing

**Database (`prisma/schema.prisma`):**
- Core models: `Patient`, `Appointment`, `Charge`, `Voicemail`, `Payment`, `PatientVoicemail` (junction)
- `PatientVoicemail` is a many-to-many join between Patient and Voicemail
- `relationJoins` preview feature is enabled

### Environment Variables (`.env`)
```
DATABASE_URL=postgresql://username:password@localhost:5432/duo
OPENAI_API_KEY=
RINGRX_API_KEY=
RINGRX_BASE_URL=https://portal.ringrx.com
PORT=3000
NODE_ENV=development
```

## Key File Locations

| Purpose | Path |
|---------|------|
| Express server entry | `src/server/server.js` |
| API router mount | `src/server/routes/api.js` |
| Excel column → Prisma field map | `src/server/services/fieldMap.js` |
| Upload controller (upsert logic) | `src/server/controllers/uploadController.js` |
| Prisma schema | `prisma/schema.prisma` |
| React entry | `src/client/main.tsx` |
| Global state context | `src/client/context/` |
| Vite config (proxy setup) | `vite.config.ts` |

## Notes

- The backend runs as ESM (`"type": "module"` in package.json); use `import`/`export`, not `require`/`module.exports` in server files
- Appointments query defaults to current month + next month date range
- Payments GET returns only unpaid EOBs (`isPaid: false`)
- Voicemail integrates with RingRX API; the `openAiController` handles AI-assisted features
- Timezone adjustment of +2 hours is applied to appointment dates during upload processing
