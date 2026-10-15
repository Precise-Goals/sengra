---
status: complete
owner: po-spec
task: T-0007
inputs: ["harness/tasks/T-0007.md", "docs/harness.md"]
acceptance_refs: ["AC-008-a", "AC-008-b", "AC-008-c", "AC-008-d"]
---

# 01-spec: Cross-Session Memory & Audit Persistence

## Problem Statement
Fraud investigation agents without persistent memory repeat redundant investigations and risk re-flagging previously cleared legitimate accounts (e.g. family clusters). SENGRA maintains cross-session memory in FalkorDB `agent_memory` and `decisions` graphs so subsequent sessions build upon historical findings and cite past decisions.

## Scope
- Implement Case persistence (`saveCase`, `getCase`).
- Implement Decision audit ledger (`saveDecision`, `getDecision`).
- Implement cross-session entity recall (`findPastInvestigations`).
- Support in-memory fallback for isolated testing and offline execution.
