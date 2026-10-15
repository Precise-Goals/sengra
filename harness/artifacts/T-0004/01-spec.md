---
status: complete
owner: po-spec
task: T-0004
inputs: ["harness/tasks/T-0004.md", "docs/harness.md"]
acceptance_refs: ["AC-003-a", "AC-003-b", "AC-005-a", "AC-005-b", "AC-008-a"]
---

# 01-spec: Graphology Analytics & Policy Engine

## Problem Statement
Relying solely on black-box LLM reasoning leads to erratic decisions and false-positive account freezes. SENGRA uses deterministic graph algorithms (Louvain, betweenness) to compute objective metrics, and strict policy functions to gate actions.

## Scope
- In-process Graphology algorithms: Louvain community partitioning, betweenness centrality, WCC cross-check.
- Policy engine: `evaluateFreezePolicy` returning `FREEZE`, `HOLD`, or `NO_ACTION`.
- Skeptic check: detecting family clusters sharing address/IP.
