---
status: complete
owner: scribe
task: T-0002
inputs: ["harness/artifacts/T-0002/05-build.md"]
acceptance_refs: ["AC-002-schema", "AC-002-client", "AC-002-ro", "AC-002-unit"]
---

# 08-docs: Schema and Graph Client Documentation

## Package Exports Documented
- `@sengra/schema`: Exports all Zod schemas and validation types.
- `@sengra/graph`: Exports `getDb`, `getGraphName`, `selectGraph`, `domain`, `agentMemory`, `decisions`, `queryGraph`, `roQueryGraph`.
