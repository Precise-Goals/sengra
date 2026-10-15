---
status: complete
owner: po-spec
task: T-0006
inputs: ["harness/tasks/T-0006.md", "docs/harness.md"]
acceptance_refs: ["AC-007-a", "AC-007-b", "AC-007-c", "AC-007-d"]
---

# 01-spec: Agent Loop & Streaming Chat Route

## Problem Statement
Fraud investigation requires multi-step autonomous graph exploration rather than single-shot queries. The agent must receive an alert, recall connected graph neighborhoods, compute Louvain community structures and bridge nodes, test alternative benign hypotheses (Skeptic challenge), and strictly gate freezing actions using deterministic policy logic.

## Scope
- Author comprehensive system prompt with graph reasoning heuristics.
- Adapt `@sengra/tools` into Vercel AI SDK tool specifications.
- Build multi-step investigation orchestrator capable of running online with Claude 3.5 Sonnet or in offline deterministic mode for testing.
- Expose `/api/chat` streaming App Router endpoint.
