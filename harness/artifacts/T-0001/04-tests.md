---
status: complete
owner: test-author
task: T-0001
inputs: ["harness/artifacts/T-0001/01-spec.md", "harness/artifacts/T-0001/03-plan.md"]
acceptance_refs: ["AC-001-env", "AC-001-ci", "AC-001-gate"]
---

# 04-tests: CI & Environment Tests

## Verification Strategy
- AC-001-env: Validate `.env.example` existence and presence of all 8 environment variables.
- AC-001-ci: Validate `.github/workflows/harness.yml` YAML syntax and job structure.
- AC-001-gate: Verify exit code 0 for `check_harness.py` and `pytest tests/harness`.
