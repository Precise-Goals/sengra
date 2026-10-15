---
status: complete
owner: tech-lead
task: T-0011
inputs: ["harness/artifacts/T-0011/01-spec.md", "harness/artifacts/T-0011/02-design.md"]
acceptance_refs: ["AC-012-a", "AC-012-b", "AC-012-c"]
---

# 03-plan: Implementation Plan for Flat-Table Baseline

## Lane Decomposition
- Lane: `baseline-eval`
- Owned paths:
  - `packages/eval/src/baseline.js`
  - `packages/eval/src/index.js`
  - `tests/unit/test-baseline.test.js`

## Plan Steps
1. Author red test in `tests/unit/test-baseline.test.js` proving:
   - Baseline evaluates single-row features.
   - Baseline misclassifies benign Ring B accounts as `FREEZE` (false positive).
   - Baseline fails to freeze multi-hop Ring A collector mule (false negative).
2. Create lane lock in `harness/state/locks/baseline-eval.json`.
3. Implement `packages/eval/src/baseline.js`.
4. Export from `packages/eval/src/index.js`.
5. Run unit test suite to turn green.
