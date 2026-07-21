# TypeScript Rules

## Strict Configuration

- `strict: true` with all sub-flags enabled (`noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, `exactOptionalPropertyTypes`)
- `noEmitOnError: true` — never generate JS when TypeScript errors exist
- Never use `// @ts-ignore` or `// @ts-expect-error` without an explanatory comment

## Banned Patterns

- **Never use `any`** — use `unknown` if the type is truly uncertain, then narrow it
- **Never use enums** — use union types or `as const` maps instead
- **Never use `as` type assertions for external data** (API responses, user input, parsed files) — always validate with Zod schemas
- **Never use classes** — use functional and declarative patterns

## Type Definitions

- Prefer `interface` over `type` for object shapes (use `type` for unions, intersections, mapped types)
- Explicitly type function parameters, return types, and object literals
- Use `readonly` for immutable properties and arrays
- Leverage utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`, etc.
- Use discriminated unions with exhaustiveness checking for type narrowing
- Use `const` assertions for literal types
- Use branded/nominal types for type-level validation where appropriate

## Advanced Patterns

- Implement generics with appropriate constraints — avoid overly loose generics
- Use mapped types and conditional types to reduce type duplication
- Validate all external data boundaries with Zod (API responses, uploads, user input)

## Code Organization

- Organize types in dedicated `types.ts` files alongside their feature/domain
- Shared types go in a central `src/types/` directory
- Document complex types with JSDoc comments
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`, `canSubmit`)
- Prefer iteration and modularization over code duplication
- Divide the project into feature-based modules, each with its own components, services, and utilities
