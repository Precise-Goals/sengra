---
status: complete
owner: test-author
task: T-0012
inputs: ["harness/artifacts/T-0012/03-plan.md"]
acceptance_refs: ["AC-013-a", "AC-013-b", "AC-013-c"]
---

# 04-tests: Test Suite for Quantitative Evaluation Benchmark

## Test Strategy
Validate precision, recall, F1, and FPR calculation functions, confusion matrix aggregation, and batch evaluation execution comparing SENGRA Graph Agent against Flat-Table Baseline.

## Test Cases
1. `calculateConfusionMatrix`: Correctly tallies TP, FP, TN, and FN.
2. `calculateMetrics`: Accurate calculation of precision, recall, F1, FPR, and accuracy; zero-division edge case resilience.
3. `runBatchEvaluation`: Executes evaluation across Ring A (mule ring), Ring B (benign family cluster), Ring C (takeover chain), and background clean nodes. Verifies Graph Agent achieves $\ge 90\%$ precision/recall and outperforms Baseline by $> 25\%$ margin.

## Red Run Evidence
- Command: `bun test tests/unit/test-evaluator.test.js`
- Exit Code: `1`
- Output:
```
error: Cannot find module '../../packages/eval/src/evaluator.js' from 'D:\Workspace\Projects\sengra\tests\unit\test-evaluator.test.js'
 0 pass
 1 fail
 1 error
```
