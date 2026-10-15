---
status: complete
owner: scribe
task: T-0012
inputs: ["harness/artifacts/T-0012/07-qa.md"]
acceptance_refs: ["AC-013-a", "AC-013-b", "AC-013-c"]
---

# 08-docs: Documentation for Evaluation Suite & Compare View

## Summary of Changes
- Package `@sengra/eval`:
  - Added `calculateConfusionMatrix`, `calculateMetrics`, and `runBatchEvaluation` in `packages/eval/src/evaluator.js`.
  - Added standalone CLI runner `packages/eval/src/cli.js` executable via `pnpm eval`.
  - Exported all evaluation functions in `packages/eval/src/index.js`.
- Next.js Web App:
  - Created `/compare` route in `apps/web/src/app/compare/page.jsx` with real-time accuracy scoreboard, scenario switcher, side-by-side agent cards, and full dataset table.
  - Added navigation link in header of `apps/web/src/app/page.jsx`.
- Test Suite:
  - Added `tests/unit/test-evaluator.test.js` validating metrics, confusion matrix, and $>25\%$ superiority margin.

## Verification
- `pnpm eval`
- `bun test tests/unit`
- `pnpm turbo run build`
- `python scripts/check_harness.py && pytest tests/harness`
