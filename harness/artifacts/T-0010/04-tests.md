---
status: red_run_captured
owner: test-author
task: T-0010
inputs: ["harness/artifacts/T-0010/01-spec.md", "harness/artifacts/T-0010/03-plan.md"]
acceptance_refs: ["AC-011-a", "AC-011-b", "AC-011-c"]
---

# 04-tests: Tests for Animated Graph Evidence Path Synchronization

## Red Run Evidence (bun test tests/unit/test-animator.test.js)

```
tests/unit/test-animator.test.js:
# Unhandled error between tests
SyntaxError: Export named 'generateStepExplanation' not found in module 'packages/ui/src/index.js'.

0 pass, 1 fail, 1 error (Failing as expected before builder implementation)
```
