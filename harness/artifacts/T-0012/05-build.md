---
status: complete
owner: builder
task: T-0012
lane: eval-compare
inputs: ["harness/artifacts/T-0012/03-plan.md", "harness/artifacts/T-0012/04-tests.md"]
acceptance_refs: ["AC-013-a", "AC-013-b", "AC-013-c"]
---

# 05-build: Implementation of Evaluation Suite & Side-by-Side Compare View

## Implemented Components
1. `packages/eval/src/evaluator.js`:
   - `calculateConfusionMatrix`: Correctly computes True Positives, False Positives, True Negatives, and False Negatives against ground truth.
   - `calculateMetrics`: Calculates Precision, Recall, F1 score, False Positive Rate (FPR), and Accuracy with resilient handling of edge case zero denominators.
   - `generateEvaluationScenarios`: Produces standardized benchmark evaluation accounts across Ring A (mule syndicate), Ring B (benign family cluster), Ring C (account takeover), and clean background accounts.
   - `runBatchEvaluation`: Executes full evaluation comparing SENGRA Graph Agent against Flat-Table Baseline.
2. `packages/eval/src/cli.js`:
   - CLI runner invoked by `pnpm eval`. Pretty-prints benchmark scoreboard table and confusion matrix comparison.
   - Exits 0 upon confirming Graph Agent precision/recall exceed baseline by $> 25\%$ margin.
3. `packages/eval/src/index.js`:
   - Re-exports all baseline and evaluation functions.
4. `apps/web/src/app/compare/page.jsx`:
   - Next.js side-by-side comparison page at `/compare`.
   - Displays real-time metrics cards, interactive scenario switcher (Ring B False Positive, Ring A False Negative, Ring C Takeover Chain), side-by-side agent comparison cards, and expandable full evaluation dataset table.
5. `apps/web/src/app/page.jsx`:
   - Added header navigation link to `/compare`.

## Verification Evidence
- `bun test tests/unit/test-evaluator.test.js`: 4/4 passing (green).
- `pnpm eval`: PASS (`+45.5%` precision improvement, `+50.0%` recall improvement, `-50.0%` FPR reduction).
- `pnpm turbo run build`: Next.js production build succeeded with static route `/compare`.
