# Reports Feature — Testing Plan

## Overview

This plan covers unit, integration, and component tests for the Reports feature across the full stack.

**Key files:**

| Layer | File |
|---|---|
| SQL safety | `src/server/domains/reports/sqlValidator.ts` |
| AI + DB logic | `src/server/domains/reports/reportServices.ts` |
| HTTP layer | `src/server/domains/reports/reportController.ts`, `reportRouter.ts` |
| State types | `src/client/context/types/state.ts` |
| Reducer | `src/client/context/reducers/reportReducer.ts` |
| Main hook | `src/client/features/reports/hooks/useReports.ts` |
| API client | `src/client/features/reports/services/reportApi.ts` |
| Components | `src/client/features/reports/components/` |

---


## Phase 1 — Setup & Tooling

### 1.1 Install test dependencies

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event jsdom msw
```

### 1.2 Configure Vitest

Create `vitest.config.ts` at the root extending `vite.config.ts` to inherit the `@client` alias:

```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/client/features/reports/**',
        'src/client/context/reducers/reportReducer.ts',
        'src/server/domains/reports/**',
      ],
    },
  },
}));
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom';
```

---

## Phase 2 — Server Unit Tests (Pure Logic, No DB)

### 2.1 SQL Validator — `sqlValidator.ts`

Highest-value, zero-dependency tests.

**`validateSelectOnly`**
- Accepts valid `SELECT` statements
- Rejects: `DROP`, `INSERT`, `UPDATE`, `DELETE`
- Rejects: `--` comments
- Rejects: stacked statements with `;`
- Rejects: `UNION`-based injection attempts

**`ensureLimitClause`**
- Adds `LIMIT 500` when absent
- Does not double-add when already present
- Respects an existing lower limit

### 2.2 Report Services — `reportServices.ts`

Mock `src/server/prisma.ts` and the `openai` client.

**Folder operations**
- `seedDefaultFolders`: idempotent (no-ops when folders exist); creates exactly 5 folders with correct `sortOrder` (0–4)
- `getAllFolders`: returns folders ordered by `sortOrder`, reports nested ordered by `createdAt desc`
- `createFolder`: computes `sortOrder = max(existing) + 1`
- `deleteFolder`: moves all reports to Uncategorized before deleting; creates Uncategorized if missing

**Report operations**
- `generateQueryFromDescription`: parses `{sql, suggestedName}` from OpenAI JSON response; throws when output is non-SELECT
- `createReport`: calls generate → validate → execute → upsert; stores `cachedData`; uses AI `suggestedName` when no name provided; falls back to Uncategorized folder when no `folderId`
- `updateReport`: regenerates query only when `description` changes; preserves `name`/`folderId` when unchanged
- `runReport`: re-executes existing `sqlQuery`, updates `cachedAt`
- `duplicateReport`: appends `" (Copy)"` to name; preserves `folderId` and `sqlQuery`

### 2.3 Report Controller — `reportController.ts`

Use `supertest` with mocked services.

- `postReport` → 400 when `description` is missing
- `getReport` → 404 when report id does not exist
- SQL validation errors surface as 400 (not 500)
- `refreshReport` delegates to `runReport` and returns updated `cachedAt`
- `cloneReport` returns 201 with the duplicated report

---

## Phase 3 — Server Integration Tests (Real DB)

Use a separate test database (`DATABASE_URL` override in `.env.test`). Run `prisma migrate deploy` in CI before the test suite.

**Full endpoint coverage** via `reportRouter.ts`:

| Method | Path | Expected |
|---|---|---|
| GET | `/api/reports/templates` | 4 hardcoded templates |
| GET | `/api/reports/folders` | Seeds defaults on first call; idempotent on repeat |
| POST | `/api/reports/folders` | 201; new folder present |
| PATCH | `/api/reports/folders/:id` | Name/sortOrder updated |
| DELETE | `/api/reports/folders/:id` | Reports migrated to Uncategorized |
| POST | `/api/reports` | 201; `cachedData` populated |
| GET | `/api/reports/:id` | 404 for unknown id |
| PATCH | `/api/reports/:id` | Description change triggers query regeneration |
| DELETE | `/api/reports/:id` | Report removed from DB |
| POST | `/api/reports/:id/run` | `cachedAt` updated |
| POST | `/api/reports/:id/duplicate` | 201; name ends with `" (Copy)"` |

---

## Phase 4 — Client Unit Tests

### 4.1 Report Reducer — `reportReducer.ts`

Pure function — no mocks needed. Cover all 13 action cases:

- `GET_FOLDERS`: replaces all folders; clears `selectedReportId` if selected report no longer exists
- `ADD_REPORT`: inserts into the correct folder (or Uncategorized); sets `selectedReportId`; sets `isCreating = false`
- `UPDATE_REPORT`: same-folder update (in-place) vs. folder move (removes from old, inserts in new)
- `DELETE_REPORT`: clears `selectedReportId` only when the deleted report was selected
- `ADD_FOLDER` / `UPDATE_FOLDER` / `DELETE_FOLDER`: sort order maintained; reports preserved on delete
- `SET_CREATING` / `SET_RUNNING` / `SET_LOADING` / `SET_ERROR` / `SET_UNSAVED`: flag toggling

### 4.2 `useReports` hook — `useReports.ts`

Wrap in a test provider that supplies `GlobalContext`.

- `allReports` is a flat array across all folders
- `selectedReport` returns the correct `ReportData` object (or `undefined`)
- `isEmpty` is `true` when all folders have zero reports
- `defaultFolders` / `customFolders` partition correctly by `isDefault`
- `getReportById` / `getFolderById` return correct items or `undefined`
- Selectors are memoized (no unnecessary re-renders on unrelated state changes)

### 4.3 `reportApi` service — `reportApi.ts`

Use **msw** handlers to mock `/api/reports/*`.

- Successful fetch returns the `data` field
- 4xx/5xx responses throw with the correct message from the response body
- `createReport` fires a toast notification on success
- `runReport` issues `POST /:id/run`
- `deleteFolder` issues `DELETE /folders/:id`

---

## Phase 5 — Client Component Tests

### 5.1 `CreateReportForm` — `CreateReportForm.tsx`

- Closed state: renders "New Report" button, not the form
- Open state: `description` field is required; submit disabled when empty
- Selecting a template prefills `description` and `name`
- `onSubmit` called with `{ name, description, folderId }`
- `onCancel` resets form to empty state

### 5.2 `ReportFolderList` — `ReportFolderList.tsx`

- Default folders: context menu (3-dot icon) is absent
- Custom folders: context menu shows Rename and Delete
- Clicking a report item calls `onSelect` with the correct report id
- Selected report item has highlighted background

### 5.3 `ReportView` — `ReportView.tsx`

- Empty state renders when `report` is `undefined`
- Loading skeleton renders when `isLoading = true`
- Delete button opens confirmation dialog; confirming calls `onDelete`; cancelling does not
- Edit dialog: submitting with a changed `description` calls `onEdit` with new values
- SQL query section toggles collapsed/expanded

### 5.4 `ReportTable` — `ReportTable.tsx`

- Columns auto-generated from the first row's keys (camelCase/snake_case → Title Case)
- Fields containing "amount", "balance", "total", "charge", "payment" formatted as currency
- Date-like columns use MUI `date` column type
- Empty `rows` array shows the empty-state message

---

## Phase 6 — End-to-End (Playwright, optional)

Full create-report journey:

1. Click "New Report" → form opens
2. Select a template → fields prefill
3. Submit → loading state visible → report appears in sidebar
4. Click Refresh → spinner visible on button → table rows update
5. Rename report → name updates in sidebar and header
6. Delete report → confirmation dialog → report removed from sidebar

---

## Test File Locations (suggested)

```
src/
  test/
    setup.ts
  server/
    domains/
      reports/
        sqlValidator.test.ts
        reportServices.test.ts
        reportController.test.ts
        reportIntegration.test.ts
  client/
    context/
      reducers/
        reportReducer.test.ts
    features/
      reports/
        hooks/
          useReports.test.ts
        services/
          reportApi.test.ts
        components/
          CreateReportForm.test.tsx
          ReportFolderList.test.tsx
          ReportView.test.tsx
          ReportTable.test.tsx
```

---

## Recommended Implementation Order

1. **Phase 2.1** — SQL Validator (purest logic, fastest wins)
2. **Phase 4.1** — Report Reducer (pure function, no infrastructure)
3. **Phase 2.2** — Report Services (mocked OpenAI + Prisma)
4. **Phase 2.3** — Report Controller (mocked services)
5. **Phase 3** — Integration tests (requires test DB)
6. **Phase 4.2–4.3** — Hook + API client
7. **Phase 5** — Component tests
8. **Phase 6** — E2E (optional)
