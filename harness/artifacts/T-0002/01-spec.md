---
status: complete
owner: po-spec
task: T-0002
inputs: ["harness/tasks/T-0002.md", "docs/harness.md"]
acceptance_refs: ["AC-002-schema", "AC-002-client", "AC-002-ro", "AC-002-unit"]
---

# 01-spec: FalkorDB Client & Zod Entity Schemas

## Problem Statement
The agent and tools require strongly typed, runtime-validated models of the graph schema, and a resilient FalkorDB Cloud client that survives serverless execution lifecycles without connection leaks or redundant TLS handshakes.

## Scope
- Zod entity schemas for nodes and relationships per `docs/raw.md` §8.
- FalkorDB client with TLS, environment prefixing, and caching on `globalThis`.
- Read-only Cypher query runner using `roQuery`.

## Acceptance Criteria Mapping
- `AC-002-schema`: Zod schemas validate Customer, Account, Device, Transaction, Subgraph, and Decision models.
- `AC-002-client`: FalkorDB client caches connection and handles prefixing (`dev_`, `test_`, `prod_`).
- `AC-002-ro`: `roQueryGraph` uses `roQuery` to guarantee read-only execution.
- `AC-002-unit`: Hermetic unit tests verify validation and prefixing.
