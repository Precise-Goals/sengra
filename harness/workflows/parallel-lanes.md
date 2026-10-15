# Parallel Lanes Workflow

> Rules and isolation mechanisms for concurrent Builder lanes.

---

## 1. Concurrency Model
- Maximum concurrent builder agents: governed by `budgets.json.max_parallel_agents` (default 3).
- In `solo` team mode, parallel lanes may be run sequentially or across isolated git worktrees.

---

## 2. Lane Isolation Rules
- **Exclusive File Ownership**: Two active lanes may NEVER own the same file path.
- **Lock Registration**: Before a lane starts, Tech Lead's file map registers paths in `harness/state/locks/<lane>.json`.
- **Branch Naming**: Each builder lane operates on `lane/<TASK-ID>-<lane>`.
- **Handoff & Merge**: Lanes merge into the task branch only after passing Gate 1 (lane lint, typecheck, lane unit tests).
- **Collision Detection**: `scripts/check_harness.py` detects overlapping ownership and rejects the state.
