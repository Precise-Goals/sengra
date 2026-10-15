---
status: complete
owner: tech-lead
task: T-0009
inputs: ["harness/artifacts/T-0009/01-spec.md", "harness/artifacts/T-0009/02-design.md"]
acceptance_refs: ["AC-010-a", "AC-010-b", "AC-010-c", "AC-010-d"]
---

# 03-plan: Implementation Plan for Case Card & Trace Panel

## Lane Decomposition
- Lane: `ui-components`
- Owned paths:
  - `packages/ui/src/case-card.jsx`
  - `packages/ui/src/trace-panel.jsx`
  - `packages/ui/src/metrics-bar.jsx`
  - `packages/ui/src/index.js`
  - `apps/web/src/app/page.jsx`
  - `tests/unit/test-case-card.test.js`

## Plan Steps
1. Author red test suite in `tests/unit/test-case-card.test.js` testing:
   - `CaseCard` badge styling and props rendering.
   - `TracePanel` step count and tool labels.
   - `MetricsBar` calculation formatting.
2. Create lane lock `harness/state/locks/ui-components.json`.
3. Implement `packages/ui/src/case-card.jsx`.
4. Implement `packages/ui/src/trace-panel.jsx`.
5. Implement `packages/ui/src/metrics-bar.jsx`.
6. Export components from `packages/ui/src/index.js`.
7. Update `apps/web/src/app/page.jsx` with the modular components.
8. Verify all tests pass 100% green.
