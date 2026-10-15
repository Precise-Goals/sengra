---
status: complete
owner: tech-lead
task: T-0012
inputs: ["harness/artifacts/T-0012/01-spec.md", "harness/artifacts/T-0012/02-design.md"]
acceptance_refs: ["AC-013-a", "AC-013-b", "AC-013-c"]
---

# 03-plan: Implementation Plan for Evaluation Suite & Compare Page

## Lane Decomposition
- Lane: `eval-compare`
- Owned paths:
  - `packages/eval/src/evaluator.js`
  - `packages/eval/src/cli.js`
  - `packages/eval/src/index.js`
  - `apps/web/src/app/compare/page.jsx`
  - `tests/unit/test-evaluator.test.js`

## Plan Steps
1. Author red test suite in `tests/unit/test-evaluator.test.js` verifying:
   - `calculateMetrics(confusionMatrix)` returns correct Precision, Recall, F1, and FPR.
   - `runBatchEvaluation()` executes across test scenarios and confirms Graph Agent > Baseline.
2. Create lane lock in `harness/state/locks/eval-compare.json`.
3. Implement `packages/eval/src/evaluator.js`.
4. Implement `packages/eval/src/cli.js`.
5. Implement `apps/web/src/app/compare/page.jsx`.
6. Run unit tests and Next.js build to verify 100% green.
