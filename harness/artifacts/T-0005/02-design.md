---
status: complete
owner: designer
task: T-0005
inputs: ["harness/artifacts/T-0005/01-spec.md"]
acceptance_refs: ["AC-006-a", "AC-006-b", "AC-006-c", "AC-006-d"]
---

# 02-design: MCP Tool Catalog & API Signatures

## Tool Catalog Design
Each tool in `packages/tools/src/catalog.js` follows MCP specification:
```javascript
{
  name: "recall_entity",
  description: "Retrieve 1-hop or 2-hop graph neighborhood for an entity",
  inputSchema: { ...Zod or JSON Schema... }
}
```

## Catalog of 11 Tools
1. `recall_entity`: Retrieve 1-hop or 2-hop neighborhood for account/device/transaction.
2. `detect_communities`: Run community detection/WCC on component.
3. `analyze_subgraph`: In-process Graphology analysis (Louvain, betweenness, density).
4. `shortest_path`: Compute shortest graph path between two nodes.
5. `skeptic_challenge`: Evaluate benign alternative explanations.
6. `evaluate_freeze_policy`: Evaluate deterministic graph rules (Rule F4).
7. `freeze_account`: Execute policy-gated account freeze.
8. `open_case`: Create case record in memory graph.
9. `notify`: Send risk notification.
10. `record_decision`: Save decision, evidence path, and Cypher query to decision graph.
11. `run_cypher_readonly`: Guarded read-only Cypher query with row limit.

## API Route Design
`apps/web/src/app/api/mcp/route.js`:
- Method: `POST`
- Request body: `{ jsonrpc: "2.0", id: string|number, method: string, params: object }`
- Supported methods:
  - `tools/list`: Returns `{ tools: [...] }`
  - `tools/call`: Executes tool and returns `{ content: [{ type: "text", text: JSON.stringify(result) }] }`
