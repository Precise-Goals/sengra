# AGENTS.md — SENGRA
> Map, not manual. Deep detail lives in linked files.

## What this is
SENGRA is a graph-native fraud investigation agent (with a security bonus layer) powered by FalkorDB Cloud, MCP tools, Vercel AI SDK (Claude), and Cytoscape.js. See [docs/harness.md](docs/harness.md).

## Start here (every session)
1. Read this file $\rightarrow$ 2. [harness/state/state.json](harness/state/state.json) $\rightarrow$ 3. [docs/prompt.md](docs/prompt.md) §1 Boot Sequence

## Commands
| purpose | command |
|---|---|
| install | `pnpm install` |
| lint | `pnpm turbo run lint` |
| format | `pnpm prettier --check "**/*.{js,jsx,json,md,yaml}"` |
| typecheck | `pnpm turbo run check-types` |
| unit test | `pnpm turbo run test` |
| integration test | `pnpm turbo run test:integration` |
| build | `pnpm turbo run build` |
| harness self-test | `python scripts/check_harness.py && pytest tests/harness` |
| seed data | `pnpm seed` |
| run eval | `pnpm eval` |

## Layout
- `apps/web`: Next.js App Router UI and API route handlers (`/api/chat`, `/api/mcp`)
- `packages/`: Workspace modules (`graph`, `schema`, `tools`, `policy`, `memory`, `analysis`, `data`, `agent`, `ui`, `eval`)
- `docs/`: Master prompt, raw problem statement, harness specification, memory logs
- `harness/`: Roles, agents, standards, workflows, state, and task artifacts
- `scripts/`: Deterministic harness linters, path guards, and circuit breakers

## Roles
| Agent | Role File | Primary Artifact |
|---|---|---|
| Orchestrator | [roles/orchestrator.md](harness/roles/orchestrator.md) | `harness/state/state.json` |
| PO-Spec | [roles/po-spec.md](harness/roles/po-spec.md) | `01-spec.md` |
| Designer | [roles/designer.md](harness/roles/designer.md) | `02-design.md` |
| Tech Lead | [roles/tech-lead.md](harness/roles/tech-lead.md) | `03-plan.md` |
| Test Author | [roles/test-author.md](harness/roles/test-author.md) | `04-tests.md` |
| Builder | [roles/builder.md](harness/roles/builder.md) | `05-build-<lane>.md` |
| Reviewer | [roles/reviewer.md](harness/roles/reviewer.md) | `06-review.md` |
| Security | [roles/security.md](harness/roles/security.md) | `06b-security.md` |
| QA | [roles/qa.md](harness/roles/qa.md) | `07-qa.md` |
| Scribe | [roles/scribe.md](harness/roles/scribe.md) | `08-docs.md` |
| Librarian | [roles/librarian.md](harness/roles/librarian.md) | `docs/memory/lessons.md` |

## Rules (top 10)
1. Never improvise outside [docs/prompt.md](docs/prompt.md) and [docs/harness.md](docs/harness.md).
2. Skinny agents ($\le 40$ lines), fat role specifications in `harness/roles/`.
3. Artifacts are the contract; no artifact means stage did not happen ([handoff contract](harness/standards/handoff-contract.md)).
4. Pure business logic in policy/analysis; zero network or DB side-effects in unit tests.
5. Plain ESM JavaScript with JSDoc typing and runtime Zod validation ([coding standards](harness/standards/coding.md)).
6. Tests first: Test Author captures failing red run before Builder touches code ([testing standards](harness/standards/testing.md)).
7. Fail loud, fail early: trip circuit breakers rather than thrash ([budgets](harness/state/budgets.json)).
8. Stay in lane: modifications outside role allow-list are rejected by `guard_paths.py`.
9. Quality gates G0–G4 must pass with deterministic evidence ([definition of done](harness/standards/definition-of-done.md)).
10. Secrets strictly forbidden; database queries must use parameterized bindings.

## Gates & breakers
- Quality gates G0 to G5 enforced deterministically per [docs/prompt.md](docs/prompt.md) §9.1.
- Circuit breaker thresholds configured in [harness/state/budgets.json](harness/state/budgets.json).

## Memory map
- Decisions: [harness/logs/decisions.log.md](harness/logs/decisions.log.md)
- Lessons & Anti-patterns: [docs/memory/lessons.md](docs/memory/lessons.md)
- Project Assumptions: [docs/memory/assumptions.md](docs/memory/assumptions.md)

## Do-not list
- Never push force or reset hard origin.
- Never deploy to production or execute destructive database drops.
- Never add blanket lint ignores or skip failing tests.

## Project notes (user)
<!-- BEGIN:nextjs-agent-rules -->
Next.js breaking changes may apply. Read guides in `node_modules/next/dist/docs/`.
<!-- END:nextjs-agent-rules -->
