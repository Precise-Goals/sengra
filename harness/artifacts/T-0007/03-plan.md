---
status: complete
owner: tech-lead
task: T-0007
inputs: ["harness/artifacts/T-0007/01-spec.md", "harness/artifacts/T-0007/02-design.md"]
acceptance_refs: ["AC-008-a", "AC-008-b", "AC-008-c", "AC-008-d"]
---

# 03-plan: Implementation Plan for Cross-Session Memory

## Lane Decomposition
- Lane: `memory-persistence`
- Owned paths:
  - `packages/memory/**`
  - `tests/unit/test-memory.test.js`

## Plan Steps
1. Write red tests in `tests/unit/test-memory.test.js` verifying:
   - Case saving and retrieval.
   - Decision persistence and lookup by entity ID.
   - Cross-session memory recall (`findPastInvestigations`).
   - Session 2 citing Session 1 case ID and clearance.
2. Create lane lock `harness/state/locks/memory-persistence.json`.
3. Implement `packages/memory/src/cases.js`.
4. Implement `packages/memory/src/decisions.js`.
5. Implement `packages/memory/src/recall.js`.
6. Implement `packages/memory/src/index.js`.
7. Verify all tests pass 100% green.
