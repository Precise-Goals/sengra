---
status: red_run_captured
owner: test-author
task: T-0009
inputs: ["harness/artifacts/T-0009/01-spec.md", "harness/artifacts/T-0009/03-plan.md"]
acceptance_refs: ["AC-010-a", "AC-010-b", "AC-010-c", "AC-010-d"]
---

# 04-tests: Tests for Live Trace Panel & Case Report Card

## Red Run Evidence (bun test tests/unit/test-case-card.test.js)

```
tests/unit/test-case-card.test.js:
# Unhandled error between tests
SyntaxError: Export named 'getVerdictStyle' not found in module 'packages/ui/src/index.js'.

0 pass, 1 fail, 1 error (Failing as expected before builder implementation)
```
