# Assumptions Log

> Project assumptions tracked across sprints.

| ID | Statement | Date | Status |
|---|---|---|---|
| `ASM-001` | A managed FalkorDB Cloud instance is available with TLS connection credentials | 2026-10-16 | ACTIVE |
| `ASM-002` | Node.js 20+ and pnpm / bun are available in the local execution environment | 2026-10-16 | ACTIVE |
| `ASM-003` | `ANTHROPIC_API_KEY` is provided in environment variables for Claude model access | 2026-10-16 | ACTIVE |
| `ASM-004` | Plain JavaScript (ESM) with JSDoc typing and Zod validation is used instead of TypeScript | 2026-10-16 | ACTIVE |
| `ASM-005` | Destructive actions (account freeze, notification) are simulated and logged to the `decisions` graph | 2026-10-16 | ACTIVE |
| `ASM-006` | Graph names are prefixed by environment (`dev_domain`, `test_domain`, `prod_domain`) to isolate data | 2026-10-16 | ACTIVE |
