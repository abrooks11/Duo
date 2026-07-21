# Testing Rules

## Stack

- **Test runner:** Vitest (Vite-native; inherits `@client` alias via `vitest.config.ts` extending `vite.config.ts`)
- **Component tests:** `@testing-library/react` + `@testing-library/user-event`
- **API mocking:** `msw` (Mock Service Worker) with `http` handlers
- **DB mocking (unit):** `vi.mock('../../prisma')` — always mock the shared Prisma instance, never hit a real DB in unit tests
- **E2E (optional):** Playwright

## File Conventions

### Unit tests — co-located with source
Unit tests live next to the source file they cover:

```
src/server/domains/reports/sqlValidator.ts
src/server/domains/reports/sqlValidator.test.ts   ← co-located unit test

src/client/features/reports/hooks/useReports.ts
src/client/features/reports/hooks/useReports.test.ts   ← co-located unit test
```

Naming: `foo.test.ts` / `foo.test.tsx`

### Integration and E2E tests — centralised in `src/test/`
Tests that require a real database, external services, or full browser context go in the central `src/test/` directory:

```
src/test/setup.ts                              ← Vitest setup file (imports @testing-library/jest-dom)
src/test/integration/reports.integration.test.ts   ← DB-touching integration tests
src/test/e2e/reports.e2e.test.ts               ← Playwright / full-stack E2E tests
```

Integration tests are skipped in the unit-test CI run.

## What to Test and How

### Server — Pure Logic (no mocks needed)
- SQL validators, pure utility functions
- Test all branches; keep tests fast and focused

### Server — Services (mock Prisma + external APIs)
- `vi.mock('src/server/prisma')` for all service tests
- `vi.mock('openai')` for any AI-dependent service
- Test: happy path, not-found (null returns), error propagation

### Server — Controllers (mock services)
- Use `supertest` with the Express app
- Test: correct status codes (200/201/400/404/500), response shape, validation rejection

### Server — Integration (real test DB)
- Requires `.env.test` with a separate `DATABASE_URL`
- Place in `src/test/integration/`
- Run `npx prisma migrate deploy` before the suite in CI
- Clean up created records in `afterEach` or use transactions

### Client — Reducers
- Always test as pure functions: `expect(reducer(state, action)).toEqual(expectedState)`
- Cover every action type; test edge cases (empty arrays, missing ids, folder moves)

### Client — Hooks
- Wrap in a minimal `GlobalContext` test provider
- Test derived/computed values and that dispatch calls result in correct state

### Client — API Services (msw)
- Set up msw server in `beforeAll` / `afterAll`
- Test: successful response extracts `data` field; error response throws with correct message; toast fires on success mutations

### Client — Components
- Render with required props; assert visible output
- Use `userEvent` for interactions (clicks, typing), not `fireEvent`
- Do not test implementation details (internal state, class names) — test user-visible behavior
- Mock service hooks at the module level (`vi.mock`) to isolate components from async logic

## Patterns

```ts
// Mock Prisma in service tests
vi.mock('../../prisma', () => ({
  default: {
    reportFolder: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    report: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

// msw handler example
http.get('/api/reports/folders', () =>
  HttpResponse.json({ data: mockFolders })
)

// Component render with context
function renderWithContext(ui: React.ReactElement) {
  return render(<GlobalContextProvider>{ui}</GlobalContextProvider>);
}
```

## Coverage Targets

| Area | Target |
|---|---|
| `sqlValidator.ts` | 100% |
| `reportReducer.ts` | 100% |
| `reportServices.ts` | ≥ 80% |
| `reportController.ts` | ≥ 80% |
| Components | ≥ 70% (critical paths) |

## What NOT to Test

- Prisma-generated types and client internals
- MUI component internals (DataGrid column rendering beyond your own logic)
- Network retry logic in `fetch` itself
- Implementation details that don't affect user-visible behavior
