---
status: complete
owner: tech-lead
task: T-0001
inputs: ["harness/artifacts/T-0001/01-spec.md", "harness/artifacts/T-0001/02-design.md"]
acceptance_refs: ["AC-001-env", "AC-001-ci", "AC-001-gate"]
---

# 03-plan: CI & Environment Implementation Plan

## File Operations
- Create `.github/workflows/harness.yml`.
- Create `.env.example`.
- Run Gate G0 self-tests locally.
