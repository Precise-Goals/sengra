---
status: complete
owner: test-author
task: T-0011
inputs: ["harness/artifacts/T-0011/01-spec.md", "harness/artifacts/T-0011/03-plan.md"]
acceptance_refs: ["AC-012-a", "AC-012-b", "AC-012-c"]
---

# 04-tests: Tests for Flat-Table Baseline Agent

## Automated Test Results (bun test tests/unit/test-baseline.test.js)

```
tests/unit/test-baseline.test.js:
(pass) Flat-Table Baseline Fraud Agent Tests > freezes accounts directly connected to known-bad devices
(pass) Flat-Table Baseline Fraud Agent Tests > reproduces False Positive failure mode on Ring B (benign family cluster)
(pass) Flat-Table Baseline Fraud Agent Tests > reproduces False Negative failure mode on Ring A (collector mule 2 hops away)
(pass) Flat-Table Baseline Fraud Agent Tests > proves Graph Agent superiority over Baseline in side-by-side comparison

4 pass, 0 fail (100% green)
```
