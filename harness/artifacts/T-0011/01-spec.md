---
status: complete
owner: po-spec
task: T-0011
inputs: ["harness/tasks/T-0011.md", "docs/harness.md"]
acceptance_refs: ["AC-012-a", "AC-012-b", "AC-012-c"]
---

# 01-spec: Flat-Table Baseline Agent Implementation

## Problem Statement
To demonstrate the quantitative value of SENGRA's graph-native agent and Skeptic challenge, we must compare against a realistic flat-table baseline. Legacy fraud systems inspect single-row SQL records and flag any account sharing an IP with multiple users, while completely missing syndicates connected through intermediaries.

## Scope
- Implement flat-table tabular evaluator `evaluateBaseline()`.
- Model naive velocity and shared-attribute rules.
- Demonstrate benchmark failures on Ring A (missed mules) and Ring B (false positive freezes on family).
