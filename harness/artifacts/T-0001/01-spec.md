---
status: complete
owner: po-spec
task: T-0001
inputs: ["harness/tasks/T-0001.md", "docs/harness.md"]
acceptance_refs: ["AC-001-env", "AC-001-ci", "AC-001-gate"]
---

# 01-spec: CI Workflow & Environment Configuration

## Problem Statement
The harness must verify deterministic integrity on every commit and push via automated GitHub Actions CI, and provide a self-documenting `.env.example` so that anyone cloning the repository can configure FalkorDB Cloud and Anthropic API credentials immediately.

## Scope
- `.github/workflows/harness.yml`: runs G0 (`python scripts/check_harness.py` and `pytest tests/harness`).
- `.env.example`: comprehensive environment variables template.
- Sprint 0 exit gate verification.
