---
status: complete
owner: tech-lead
task: T-0008
inputs: ["harness/artifacts/T-0008/01-spec.md", "harness/artifacts/T-0008/02-design.md"]
acceptance_refs: ["AC-009-a", "AC-009-b", "AC-009-c"]
---

# 03-plan: Implementation Plan for Dark Ops Console & Cytoscape Canvas

## Lane Decomposition
- Lane: `ui-cytoscape`
- Owned paths:
  - `packages/ui/**`
  - `apps/web/src/app/page.jsx`
  - `tests/unit/test-ui.test.js`

## Plan Steps
1. Write red tests in `tests/unit/test-ui.test.js` verifying:
   - Cytoscape styles map entity labels to expected colors.
   - Known bad device condition generates red styling `#ef4444`.
   - Node and edge converter translates raw graph format into Cytoscape elements.
2. Create lane lock `harness/state/locks/ui-cytoscape.json`.
3. Implement `packages/ui/src/styles.js`.
4. Implement `packages/ui/src/graph-canvas.jsx`.
5. Implement `packages/ui/src/index.js`.
6. Implement `apps/web/src/app/page.jsx`.
7. Verify all tests pass 100% green.
