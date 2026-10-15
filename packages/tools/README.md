# @sengra/tools

Model Context Protocol (MCP) tool catalog and execution engine for SENGRA fraud investigations.

## Tools Catalog

| Tool Name | Purpose | Gated / Pure |
|---|---|---|
| `recall_entity` | Retrieve 1-hop or 2-hop neighborhood for an entity | Graph Read |
| `detect_communities` | Run community detection / WCC partitioning | Graph Read |
| `analyze_subgraph` | In-process Graphology analysis (Louvain, betweenness) | Pure Analysis |
| `shortest_path` | Compute shortest graph path between accounts/devices | Graph Read |
| `skeptic_challenge` | Test benign alternative explanations (family clusters) | Pure Policy |
| `evaluate_freeze_policy` | Evaluate evidence against deterministic Rule F4 | Pure Policy |
| `freeze_account` | Execute simulated account freeze and log action | Simulated Mutation |
| `open_case` | Open investigation record in memory graph | Simulated Mutation |
| `notify` | Dispatch simulated alert to compliance channel | Side-Effect |
| `record_decision` | Save verdict, explanation, and evidence path | Audit Graph |
| `run_cypher_readonly` | Guarded read-only Cypher query with row limits | Guarded Read |

## API Route (`/api/mcp`)
Exposes JSON-RPC 2.0 endpoints for remote agents and local MCP clients:
- `tools/list`: Returns list of all 11 tool definitions and schemas.
- `tools/call`: Executes tool and returns result.
