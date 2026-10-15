# SENGRA Backlog

> Prioritized requirement clusters ordered by MoSCoW and sprint mapping.

| ID | Title | Priority | Sprint | REQ Ref | Status | Task Ref |
|---|---|---|---|---|---|---|
| `BL-000` | Harness scaffolding, self-tests, and monorepo structure | Must | Sprint 0 | Core Harness | **Done** | T-0000 |
| `BL-001` | FalkorDB Cloud client, connection caching, and graph schema | Must | Sprint 1 | REQ-001 | **Done** | T-0002 |
| `BL-002` | Seeded synthetic data generator with planted scenarios and ground truth | Must | Sprint 1 | REQ-009 | **Done** | T-0003 |
| `BL-003` | In-database FalkorDB algorithms (WCC, PageRank, shortestPath) | Must | Sprint 1 | REQ-002 | **Done** | T-0002 |
| `BL-004` | In-process graphology analysis (Louvain, betweenness, WCC cross-check) | Must | Sprint 1 | REQ-003 | **Done** | T-0004 |
| `BL-005` | Pure deterministic freeze policy engine and skeptic challenge rules | Must | Sprint 1 | REQ-005, REQ-008 | **Done** | T-0004 |
| `BL-006` | MCP tool server route (/api/mcp) with Zod schemas and security secret | Must | Sprint 2 | REQ-004 | **Done** | T-0005 |
| `BL-007` | Agent execution loop (/api/chat) with streaming tool selection | Must | Sprint 2 | REQ-004, REQ-007 | **Done** | T-0006 |
| `BL-008` | Cross-session memory recall and decisions audit graph persistence | Must | Sprint 2 | REQ-006, REQ-007 | **Done** | T-0007 |
| `BL-009` | Next.js investigation UI with Cytoscape.js interactive graph canvas | Should | Sprint 3 | REQ-010 | **Done** | T-0008 |
| `BL-010` | Streaming tool trace panel and case report card with metrics | Should | Sprint 3 | REQ-011 | **Done** | T-0009 |
| `BL-011` | Animated evidence path highlighting synchronized with explanation narrative | Should | Sprint 3 | REQ-010 | **Done** | T-0010 |
| `BL-012` | Flat-table baseline agent and comparative evaluation runner (pnpm eval) | Should | Sprint 4 | REQ-012 | **Done** | T-0011 |
| `BL-013` | Side-by-side baseline comparison page (/compare) with live metrics | Should | Sprint 4 | REQ-012 | **Done** | T-0012 |
| `BL-014` | Security triage bonus layer: CVE-to-fraud bridge query and blast radius | Could | Sprint 5 | REQ-013 | **Done** | T-0013 |
| `BL-015` | Multi-agent split (Investigator, Skeptic, Actioner) sharing graph state | Won't | Stretch | REQ-014 | Deferred | - |
