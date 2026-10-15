# Coding Standards — JavaScript (ESM)

> Standards for JavaScript, React, Next.js, and FalkorDB implementations.

---

## 1. Language & Module Format
- **ECMAScript Modules (ESM)**: All packages specify `"type": "module"` in their `package.json`. Use standard `import` and `export` statements.
- **No TypeScript Transpilation for App Packages**: Plain JavaScript with strict ESLint checks.
- **Type Safety via JSDoc & Zod**:
  - Use JSDoc `@typedef`, `@param`, `@returns` for internal IDE hints and navigation.
  - Use Zod schemas with `.parse()` or `.safeParse()` at all external boundaries: API route parameters, MCP tool inputs, and FalkorDB query results.

---

## 2. Architecture & Design Patterns
- **Pure Business Logic**: `packages/policy` and `packages/analysis` must export pure functions without network or database side-effects.
- **Database Connection Caching**: Cache the FalkorDB client on `globalThis` (`globalThis._falkor ??= ...`) to prevent redundant TLS socket handshakes across serverless warm restarts.
- **Read-Only Guards**: Query tools that only inspect data must use FalkorDB's `roQuery` method and execute within read-only constraints.
- **Naming Conventions**:
  - CamelCase for functions and variables (`analyzeSubgraph`, `accountId`).
  - PascalCase for React components and Zod schemas (`CaseCard`, `AccountNodeSchema`).
  - Kebab-case for file and folder names (`find-linked-accounts.js`, `case-report-card.jsx`).

---

## 3. Style & Formatting
- Code formatted with Prettier: double quotes, trailing commas, 2-space indentation.
- Run `pnpm turbo run lint` and `pnpm prettier --check ...` to verify.
