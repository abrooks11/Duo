# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duo is a full-stack healthcare data integration platform designed for small to mid-size healthcare facilities. It ingests CSV and XML exports from various healthcare systems (practice management, billing, voicemail) and consolidates them into a unified PostgreSQL database with a React-based frontend for data management.

## Development Commands

### Starting the Application
```bash
# Start both frontend and backend concurrently
npm run start

# Start frontend only (Vite dev server on port 5173)
npm run dev

# Start backend only (Express server on port 3000)
npm run server
```

### Database Operations
```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Apply database migrations
npx prisma migrate dev

# Generate Prisma client after schema changes
npx prisma generate
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting without modifying files
npm run format:check
```

### Building
```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Material-UI (MUI), Tailwind CSS
- **Backend**: Express.js, Node.js (ES modules)
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Context API with Immer for immutable updates
- **Build Tool**: Vite with SWC for fast compilation

### Project Structure

#### Backend (`src/server/`)
The backend follows a **domain-driven architecture** where each business domain is self-contained:

```
src/server/
├── server.js                    # Express app entry point
├── routes/
│   └── api.ts                   # Main API router that aggregates domain routers
└── domains/
    ├── appointments/            # Appointment management
    ├── patients/                # Patient records
    ├── claims/                  # Insurance claims
    ├── payments/                # Payment processing
    ├── voicemail/               # RingRX voicemail integration
    ├── sms/                     # SMS functionality
    ├── upload/                  # Excel/CSV file ingestion
    ├── ai/                      # OpenAI integration
    ├── estimates/               # Insurance estimates
    ├── auth/                    # Authentication utilities
    └── tebra-api/               # Tebra API integration (in progress)
```

Each domain typically contains:
- `{domain}Router.ts` - Express router for the domain's endpoints
- `{domain}Controller.ts` - Request handlers and business logic
- `{domain}Services.ts` - Database operations and external API calls

**Authentication Pattern**: The `auth/` domain contains middleware for third-party API authentication. Example: `ensureRingAuth` middleware in `authMiddleware.ts` handles RingRX token management by:
- Checking for existing token in cookies
- Refreshing token if missing/expired
- Attaching token and refresh function to `req` object for controllers

#### Frontend (`src/client/`)
The frontend uses a **feature-based architecture**:

```
src/client/
├── main.tsx                     # React entry point
├── App.tsx                      # Root component with routing
├── context/
│   ├── GlobalContext.tsx        # Global state provider using Immer
│   ├── reducers/                # State reducers by domain
│   └── types/                   # TypeScript types for state/actions
├── features/                    # Feature modules
│   ├── appointments/
│   ├── voicemail/
│   ├── sms/
│   ├── payments/
│   ├── reports/
│   └── tebra/
├── components/
│   ├── layout/                  # Nav, Sidebar, TopNav, Footer
│   ├── tables/                  # Reusable Table component
│   ├── ui/                      # UI primitives (DropDown, ActionMenu, etc.)
│   └── sidebar/                 # Filtering/calendar components
├── pages/                       # Top-level page components
└── hooks/                       # Shared custom hooks
```

Each feature typically contains:
- `components/` - Feature-specific React components
- `hooks/` - Feature-specific React hooks
- `services/` - API calls and business logic
  - `{feature}Api.ts` - API endpoint calls
  - `{feature}Services.ts` - Additional service logic

**State Management Pattern**: The application uses Context + Reducers with Immer for immutable state updates. Global state is divided by domain (appointments, patients, claims, voicemail). Each domain in the global state typically includes:
- `data`: Array of records from the database
- `allColumnHeaders`: Column configuration for tables
- `rowFilterDetails`: Filter options and their state
- `selectedDateRange`: Date range for filtering (where applicable)

#### Database (`prisma/`)
Prisma schema defines the relational model:
- **Core Resources**: `Patient`, `Appointment`, `Charge`, `Voicemail`
- **Payment Processing**: `Deposit`, `Eob` (Explanation of Benefits)
- **Relationships**: `PatientVoicemail` junction table for many-to-many

### Key Architectural Patterns

#### 1. File Upload and Data Ingestion
The `/upload` domain handles Excel/CSV imports with resource-specific logic:
- Route pattern: `POST /api/upload/:resourceType/:sheetName`
- Supports: `patient`, `appointment`, `deposit`, `eob`
- Uses `excelServices.ts` to parse files and `fieldMap.ts` to normalize column names
- Implements upsert logic: compares `lastModifiedDate` to update only if incoming data is newer
- Patient relationships validated before creating appointments

#### 2. Third-Party API Integration
**RingRX Voicemail**:
- Authentication handled by `ensureRingAuth` middleware
- Token stored in HTTP-only cookies
- Controllers access token via `req.ringToken`
- Can refresh token mid-request using `req.refreshRingToken()`

**OpenAI Integration**:
- Used for AI-enhanced features (insurance eligibility extraction, etc.)
- Accessed via `/api/openai` routes

#### 3. Frontend Data Flow
1. Component calls API via feature service (e.g., `appointmentApi.ts`)
2. Service makes fetch request to backend
3. Response dispatched to global context reducer
4. Reducer updates relevant domain state (e.g., `appointments.data`)
5. Components re-render with new data from context

#### 4. API Proxy Configuration
Vite dev server proxies `/api` requests to Express backend (port 3000), enabling seamless development without CORS issues.

## Environment Configuration

Required environment variables (see `.env.example`):
```env
PORT=3000                                    # Backend server port
NODE_ENV=development
DATABASE_URL=postgresql://...                # PostgreSQL connection string
RING_USER_NAME=...                           # RingRX credentials
RING_PASSWORD=...
OPENAI_API_KEY=...                           # OpenAI API key
```

## Key Conventions

### Backend
- Use ES modules (`import`/`export`) consistently
- Error handling: Pass errors to Express error handler with format:
  ```typescript
  next({
    status: number,
    message: { err: string },
    log: string
  })
  ```
- Prisma client import: `import { PrismaClient } from '@prisma/client'`
- TypeScript files use `.ts` extension and must be imported with `.ts` extension in import statements

### Frontend
- Import alias: `@client` maps to `src/client/` (configured in `vite.config.ts`)
- API calls should handle loading and error states
- Use Material-UI components for consistent styling
- Tailwind CSS available for utility-based styling

### Database
- All models have `id` as primary key
- Use `lastModifiedDate` for conflict resolution during upserts
- Foreign key relationships use Prisma's `@relation` decorator
- Apply migrations with `npx prisma migrate dev`

## Integration Points

- **RingRX Portal**: Voicemail system integration via REST API
- **Tebra**: Patient management system integration (in development)
- **OpenAI**: Used for intelligent data extraction and analysis
- **Healthcare Exports**: Imports from practice management systems via Excel/CSV
