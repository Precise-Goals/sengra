---
status: complete
owner: tech-lead
task: T-0014
inputs: ["harness/artifacts/T-0014/01-spec.md", "harness/artifacts/T-0014/02-design.md"]
acceptance_refs: ["AC-015-a", "AC-015-b", "AC-015-c", "AC-015-d"]
---

# 03-plan: Implementation Plan for Hardening, Demo & Quality Gate Verification

## Lane Allocation
- Lane: `hardening-demo`
- Owned paths:
  - `scripts/demo.js`
  - `scripts/verify_gates.py`
  - `README.md`
  - `docs/architecture.md`
  - `docs/eval-report.md`
  - `tests/integration/test-e2e.test.js`
  - `docs/memory/lessons.md`
  - `harness/logs/decisions.log.md`

## Steps
1. Author red integration test suite in `tests/integration/test-e2e.test.js` testing full multi-step agent flow, cross-session citations, and security bridge execution.
2. Establish lane lock in `harness/state/locks/hardening-demo.json`.
3. Implement `scripts/demo.js` with ANSI colors, progress bars, and sequential execution.
4. Implement `scripts/verify_gates.py` verifying all five quality gates.
5. Author master `README.md`, `docs/architecture.md`, `docs/eval-report.md`, and update memory logs.
6. Run integration and unit tests, build, and verify G0–G4 pass 100%.
