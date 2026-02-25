# Reports Feature Specification

## Problem Statement
The EMR produces specific kinds of reports, but custom reports are needed. For example, automated yearly reminders - generating a list of patients seen in 2025 who do not have a 2026 appointment scheduled.

## Solution
Build a Reports page where users describe reports in natural language, AI generates SQL queries, and results are displayed in a full-featured table with Excel export.

---

## Requirements Summary

| Category | Decision |
|----------|----------|
| Query visibility | View-only (users see SQL but can't edit) |
| Data freshness | Cached in DB + manual Refresh button |
| Queryable tables | All clinical: Patient, Appointment, Charge, Deposit, Eob |
| Result limit | Hard 500-row limit |
| Export format | .xlsx Excel |
| Create flow | Inline form (expands in sidebar) |
| Templates | 3-4 recall-focused clickable templates |
| Folders | Pre-defined by data type + user-created |
| Query safety | Strict SELECT-only validation |
| Table features | Full: sort, filter, column show/hide |
| Report naming | Required field + AI-suggested name |
| Clone feature | Yes - duplicate existing reports |
| Save behavior | Prompt to save before navigating away |
| Date handling | Dynamic relative dates (AI interprets at runtime) |
| Loading state | Skeleton table |
| AI model | Configurable via environment variable |
| Platform | Desktop-focused |

---

## MVP Journey
1. User creates new report via inline form
2. User enters name and description (or clicks template)
3. AI generates SQL query
4. Server validates query (SELECT-only)
5. Server executes query with 500-row limit
6. Server caches results in database
7. Client displays results in full-featured table
8. User can export to Excel, refresh, edit, or delete

---

## User Actions (CRUD+)
- **Create**: Name + Description (with AI-suggested name)
- **Read**: View report with cached data
- **Update**: Edit name/description (regenerates query)
- **Delete**: Remove report
- **Refresh**: Re-run query for fresh data
- **Duplicate**: Clone existing report
- **Export**: Download as .xlsx Excel file
- **Organize**: Move between folders

---

## UI Components

### Sidebar (Left - 300px)
- **New Report Button** - Opens inline create form
- **Folder Tree** - Collapsible folders with reports
  - Patients (default)
  - Appointments (default)
  - Claims (default)
  - Payments (default)
  - Uncategorized (default)
  - User-created folders
- **Report List Items** - Name + truncated description
- **New Folder Button**

### Create Report Form (Inline in sidebar)
- Name field (required, AI-suggested placeholder)
- Description textarea
- Template chips (clickable, pre-fill description)
- Cancel / Create buttons

### Main Content (Right)
- Report title
- SQL query display (view-only, collapsible)
- Action buttons: Refresh, Export, Edit, Delete, Duplicate
- Results table with skeleton loading
  - Sortable columns
  - Column filtering
  - Column show/hide

### Dialogs
- Save prompt ("Save before leaving?")
- Delete confirmation
- Error display with retry option

---

## Template Definitions

```javascript
const REPORT_TEMPLATES = [
  {
    label: 'Annual Recall',
    description: 'Patients seen in 2025 who do not have a 2026 appointment scheduled'
  },
  {
    label: 'No Future Appointment',
    description: 'Patients with appointments in the past 12 months but no future appointments'
  },
  {
    label: 'Inactive Patients',
    description: 'Patients who have not been seen in the last 90 days'
  },
  {
    label: 'New Patients This Month',
    description: 'Patients whose first appointment was within the current month'
  }
];
```

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        Reports Page                          │
├──────────────────┬──────────────────────────────────────────┤
│   SIDEBAR        │              MAIN CONTENT                 │
│   (300px)        │                                          │
│                  │  ┌────────────────────────────────────┐  │
│  [+ New Report]  │  │  Report Name                       │  │
│                  │  │  ──────────────────────────────    │  │
│  ▼ Patients      │  │  SQL Query (view-only)             │  │
│    • Report 1    │  │  ┌──────────────────────────────┐  │  │
│    • Report 2    │  │  │ SELECT * FROM ...            │  │  │
│                  │  │  └──────────────────────────────┘  │  │
│  ▼ Appointments  │  │                                    │  │
│    • Report 3    │  │  [Refresh] [Export] [Edit] [Delete]│  │
│                  │  │                                    │  │
│  ▼ Claims        │  │  Results Table (skeleton loading)  │  │
│    (empty)       │  │  ┌──────────────────────────────┐  │  │
│                  │  │  │ Col1 │ Col2 │ Col3 │ Col4    │  │  │
│  ▼ Payments      │  │  ├──────┼──────┼──────┼─────────┤  │  │
│    (empty)       │  │  │ ...  │ ...  │ ...  │ ...     │  │  │
│                  │  │  └──────────────────────────────┘  │  │
│  ▼ Uncategorized │  │                                    │  │
│    (empty)       │  └────────────────────────────────────┘  │
│                  │                                          │
│  [+ New Folder]  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

---

## Database Schema

### Prisma Models

```prisma
model Report {
  id            String    @id @default(cuid())
  name          String
  description   String    // User's natural language description
  sqlQuery      String    // AI-generated SQL query
  cachedData    Json?     // Cached report results
  cachedAt      DateTime? // When cache was last updated
  folderId      String?
  folder        ReportFolder? @relation(fields: [folderId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model ReportFolder {
  id          String    @id @default(cuid())
  name        String
  isDefault   Boolean   @default(false)
  sortOrder   Int       @default(0)
  reports     Report[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Default Folders (seed)
1. Patients (sortOrder: 0)
2. Appointments (sortOrder: 1)
3. Claims (sortOrder: 2)
4. Payments (sortOrder: 3)
5. Uncategorized (sortOrder: 4)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Get all reports with folders |
| GET | `/api/reports/:id` | Get single report |
| POST | `/api/reports` | Create report (triggers AI) |
| PUT | `/api/reports/:id` | Update report |
| DELETE | `/api/reports/:id` | Delete report |
| POST | `/api/reports/:id/run` | Re-run query (refresh) |
| POST | `/api/reports/:id/duplicate` | Clone report |
| GET | `/api/reports/folders` | Get all folders |
| POST | `/api/reports/folders` | Create folder |
| PUT | `/api/reports/folders/:id` | Update folder |
| DELETE | `/api/reports/folders/:id` | Delete folder |
| GET | `/api/reports/templates` | Get templates |

---

## File Structure

### Backend
```
src/server/domains/reports/
├── reportRouter.ts
├── reportController.ts
├── reportServices.ts
├── reportTypes.ts
└── sqlValidator.ts
```

### Frontend
```
src/client/features/reports/
├── components/
│   ├── ReportsSidebar.tsx
│   ├── ReportFolderList.tsx
│   ├── ReportListItem.tsx
│   ├── CreateReportForm.tsx
│   ├── ReportView.tsx
│   ├── ReportTable.tsx
│   ├── ReportActions.tsx
│   ├── TemplateSelector.tsx
│   └── SavePromptDialog.tsx
├── hooks/
│   └── useReports.ts
├── services/
│   ├── reportApi.ts
│   └── reportServices.ts
└── index.ts
```

---

## Security: SQL Validation

```typescript
export function validateSelectOnly(sql: string): { valid: boolean; error?: string } {
  const normalized = sql.trim().toUpperCase();

  if (!normalized.startsWith('SELECT')) {
    return { valid: false, error: 'Only SELECT queries are allowed' };
  }

  const blocked = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE'];
  for (const keyword of blocked) {
    if (normalized.includes(keyword)) {
      return { valid: false, error: `Forbidden keyword: ${keyword}` };
    }
  }

  return { valid: true };
}
```

---

## Implementation Phases

### Phase 1: Database & Backend Foundation
- Add Prisma models
- Run migration
- Seed default folders
- Create report domain (router, controller, services)
- Add SQL validator
- Register router in api.ts

### Phase 2: AI Integration
- Query generation with schema context
- Suggested name generation
- Query execution with 500-row limit
- Error handling for invalid queries

### Phase 3: Frontend State
- Add types to context
- Create reportReducer
- Update root reducer
- Create useReports hook
- Create API services

### Phase 4: Frontend UI
- Reports.tsx page layout
- Sidebar with folder tree
- Create form with templates
- Report view with table
- Action buttons

### Phase 5: Additional Features
- Excel export (.xlsx)
- Duplicate functionality
- Folder CRUD
- Save prompt dialog
- Edit report flow

---

## Environment Variables

```env
OPENAI_MODEL=gpt-4o-mini  # Configurable AI model
```
