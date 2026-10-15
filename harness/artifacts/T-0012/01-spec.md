---
status: complete
owner: po-spec
task: T-0012
inputs: ["harness/tasks/T-0012.md", "docs/harness.md"]
acceptance_refs: ["AC-013-a", "AC-013-b", "AC-013-c"]
---

# 01-spec: Evaluation Suite & Side-by-Side Compare View

## Problem Statement
Claiming superiority without empirical metrics fails due diligence. SENGRA must provide deterministic, reproducible benchmark numbers comparing the graph agent against flat-table rules, and an intuitive side-by-side comparison interface where reviewers can inspect the contrast directly.

## Scope
- Implement `runBatchEvaluation()` testing accounts from Ring A, Ring B, Ring C, and noise.
- Calculate Precision, Recall, F1 score, and False-Positive Rate.
- Implement CLI script for `pnpm eval`.
- Implement `/compare` App Router page.
