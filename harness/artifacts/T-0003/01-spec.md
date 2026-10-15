---
status: complete
owner: po-spec
task: T-0003
inputs: ["harness/tasks/T-0003.md", "docs/harness.md"]
acceptance_refs: ["AC-009-a", "AC-009-ring-a", "AC-009-ring-b", "AC-009-gt"]
---

# 01-spec: Seeded Synthetic Data Generator & Ground Truth

## Problem Statement
Fraud investigation agents cannot be reliably evaluated without controlled, reproducible graph datasets where fraud rings and false-positive benign clusters are deterministically planted and labeled.

## Scope
- Planted Ring A: 8 accounts, shared devices (D-17 known bad), circular payment loop.
- Planted Ring B: 5 accounts, family cluster with shared address and IP.
- Planted Ring C: 4 compromised accounts linked via credentials.
- Background noise: ~1,500 normal accounts and merchants.
- `ground_truth.json` export.
