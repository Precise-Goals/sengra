---
status: complete
owner: builder
task: T-0005
inputs: ["harness/artifacts/T-0005/03-plan.md", "harness/artifacts/T-0005/04-tests.md"]
acceptance_refs: ["AC-006-a", "AC-006-b", "AC-006-c", "AC-006-d"]
---

# 05-build: MCP Tool Catalog & API Route Implementation

## Changes Implemented
1. `packages/tools/src/catalog.js`:
   - Registered 11 MCP fraud tools with full JSON Schema parameter definitions: `recall_entity`, `detect_communities`, `analyze_subgraph`, `shortest_path`, `skeptic_challenge`, `evaluate_freeze_policy`, `freeze_account`, `open_case`, `notify`, `record_decision`, `run_cypher_readonly`.
2. `packages/tools/src/security.js`:
   - Implemented `assertReadOnlyCypher`: Regex filter disallowing `CREATE`, `DELETE`, `SET`, `REMOVE`, `MERGE`, `DROP`, `DETACH`, `CALL dbms`, `ALTER`, `GRANT`, `REVOKE`. Enforces maximum row limit of 1,000.
3. `packages/tools/src/handlers.js`:
   - Tool execution handlers invoking `@sengra/graph`, `@sengra/analysis`, and `@sengra/policy`.
4. `packages/tools/src/index.js`:
   - Dispatches calls via `executeTool(name, params)` with pre-execution validation via `validateToolParams`.
5. `apps/web/src/app/api/mcp/route.js`:
   - Next.js App Router POST handler providing JSON-RPC 2.0 endpoints for `tools/list` and `tools/call`, plus GET health check.
