---
status: complete
owner: tech-lead
task: T-0005
inputs: ["harness/artifacts/T-0005/01-spec.md", "harness/artifacts/T-0005/02-design.md"]
acceptance_refs: ["AC-006-a", "AC-006-b", "AC-006-c", "AC-006-d"]
---

# 03-plan: Implementation Plan for MCP Tool Catalog & API Route

## Lane Decomposition
- Lane: `mcp-tools`
- Owned paths:
  - `packages/tools/**`
  - `apps/web/src/app/api/mcp/route.js`
  - `tests/unit/test-tools.test.js`

## Plan Steps
1. Write red tests in `tests/unit/test-tools.test.js` checking:
   - Tool catalog exports 11 valid tools with inputSchemas.
   - Validation rejects invalid tool arguments.
   - `analyze_subgraph` handler runs graphology correctly.
   - `evaluate_freeze_policy` and `skeptic_challenge` handlers execute policy logic.
   - `run_cypher_readonly` rejects write queries (`CREATE`, `DELETE`, `MERGE`, `DROP`).
2. Implement `packages/tools/src/catalog.js`.
3. Implement `packages/tools/src/handlers/*.js` and `packages/tools/src/index.js`.
4. Implement `apps/web/src/app/api/mcp/route.js`.
5. Run tests to turn green.
