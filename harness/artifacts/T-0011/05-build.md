---
status: complete
owner: builder
task: T-0011
inputs: ["harness/artifacts/T-0011/03-plan.md", "harness/artifacts/T-0011/04-tests.md"]
acceptance_refs: ["AC-012-a", "AC-012-b", "AC-012-c"]
---

# 05-build: Flat-Table Baseline Agent Implementation

## Changes Implemented
1. `packages/eval/src/baseline.js`:
   - `evaluateBaseline(row)`: Evaluates single-row tabular attributes (direct device badness, shared network count, velocity).
   - Modeled False Positive on Ring B: Naively triggers `FREEZE` for family members sharing a home network due to lack of Skeptic challenge.
   - Modeled False Negative on Ring A: Fails to detect collector mule 2 hops away from confirmed bad device D-17.
   - `compareAgentVsBaseline(context)`: Runs side-by-side comparison proving SENGRA Graph Agent's accuracy over the baseline.
2. `packages/eval/src/index.js`:
   - Exported `evaluateBaseline` and `compareAgentVsBaseline`.
