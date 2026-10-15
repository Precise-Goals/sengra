---
status: complete
owner: designer
task: T-0001
inputs: ["harness/artifacts/T-0001/01-spec.md"]
acceptance_refs: ["AC-001-env", "AC-001-ci", "AC-001-gate"]
---

# 02-design: CI Pipeline & Environment Template

## CI Pipeline Specification
- Trigger: push to `master`, pull_request on `master`.
- Runner: `ubuntu-latest`.
- Steps:
  1. Checkout code.
  2. Set up Python 3.12.
  3. Install dependencies (`pytest`, `pyyaml`).
  4. Run `python scripts/check_harness.py`.
  5. Run `pytest tests/harness`.
