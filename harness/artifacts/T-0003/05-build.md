---
status: complete
owner: builder
task: T-0003
inputs: ["harness/artifacts/T-0003/03-plan.md", "harness/artifacts/T-0003/04-tests.md"]
acceptance_refs: ["AC-009-a", "AC-009-ring-a", "AC-009-ring-b", "AC-009-gt"]
---

# 05-build: Data Generator & Ground Truth Implementation

## Changes Implemented
1. `packages/data/src/ground-truth.js`: Defined Ring A (mule ring), Ring B (family cluster), and Ring C (takeover chain).
2. `packages/data/ground_truth.json`: Exported structured ground truth mapping.
3. `packages/data/src/generator.js`: Implemented deterministic `@faker-js/faker` generator outputting ~1,500+ nodes and edges.
4. `packages/data/src/seed.js`: Implemented FalkorDB database seeding runner.
