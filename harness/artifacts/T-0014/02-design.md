---
status: complete
owner: designer
task: T-0014
inputs: ["harness/artifacts/T-0014/01-spec.md"]
acceptance_refs: ["AC-015-a", "AC-015-b", "AC-015-c", "AC-015-d"]
---

# 02-design: Architecture for Interactive Demo & Gate Verification

## Demo Runner Execution Flow (`scripts/demo.js`)
```
[Start Demo]
    |
    v
Step 1: Planted Ring A (Mule Ring) -> Rule F4 Freeze Action -> Store in agent_memory
    |
    v
Step 2: Planted Ring B (Family Cluster) -> Skeptic Challenge Clearance -> Store Clearance in agent_memory
    |
    v
Step 3: Cross-Session Recall -> Re-evaluating Ring B cites prior run in < 10ms -> Confirms Clearance
    |
    v
Step 4: Planted Ring C (Security Bridge) -> CVE-2024-3094 -> Auth Portal -> Leaked Credentials -> 4 Accounts Frozen
    |
    v
Step 5: Comparative Evaluation Summary -> Prints 100% Precision / Recall vs 54.5% Baseline
    |
    v
[Demo Concluded with Pass Verdict]
```

## Gate G0–G4 Checklist
- **G0 (Harness Integrity)**: `scripts/check_harness.py && pytest tests/harness` (0 problems, 21 tests pass).
- **G1 (Typecheck, Lint & Build)**: `pnpm turbo run build` (Static generation of `/`, `/compare`, `/security`).
- **G2 (Test Coverage)**: Unit and integration suites pass 100% green without flaky tests.
- **G3 (Reproducibility & Performance)**: Evaluation benchmark runs offline in $< 100$ms with deterministic metrics.
- **G4 (Security & Parameterization Audit)**: Zero unparameterized Cypher queries; no hardcoded credentials or API keys.
