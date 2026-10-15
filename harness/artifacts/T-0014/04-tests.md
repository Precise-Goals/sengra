---
status: complete
owner: test-author
task: T-0014
inputs: ["harness/artifacts/T-0014/03-plan.md"]
acceptance_refs: ["AC-015-a", "AC-015-b", "AC-015-c", "AC-015-d"]
---

# 04-tests: Integration & End-to-End Test Suite

## Test Strategy
Validate end-to-end multi-step agent flow, cross-session memory recall, cybersecurity cross-domain bridge queries, and quantitative evaluation benchmarks in an integrated execution environment without external network dependencies.

## Test Cases (`tests/integration/test-e2e.test.js`)
1. `Ring A Investigation`: Freezes mule ring via 2-hop bad device link with $\ge 90\%$ confidence.
2. `Ring B Clearance`: Proactively clears benign family cluster via Skeptic challenge.
3. `Cross-Session Citation`: Recalls past clearance from `agent_memory` in Run 2, confirming clearance without redundant re-investigation.
4. `Cybersecurity Bridge`: Traverses CVE-2024-3094 -> vulnerable auth gateway -> leaked credentials -> compromised accounts.
5. `Evaluation Benchmark`: Validates Graph Agent achieves 100% precision/recall and beats baseline by $> 25\%$ margin.

## Verification Evidence
- Command: `bun test tests/integration/test-e2e.test.js`
- Exit Code: `0`
- Results: 5 passed, 0 failed, 23 assertions passed.
