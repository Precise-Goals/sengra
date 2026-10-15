---
status: complete
owner: po-spec
task: T-0009
inputs: ["harness/tasks/T-0009.md", "docs/harness.md"]
acceptance_refs: ["AC-010-a", "AC-010-b", "AC-010-c", "AC-010-d"]
---

# 01-spec: Live Trace Panel & Case Report Card

## Problem Statement
While raw JSON provides data, human fraud analysts need a clear, structured report card for audit compliance and a step-by-step reasoning trace showing exactly which tools were invoked, what evidence was retrieved, and how the policy rule reached its verdict.

## Scope
- Build `CaseCard` displaying verdict, confidence, policy explanation, and evidence chips.
- Build `TracePanel` presenting collapsible execution trace of tool calls.
- Build `MetricsBar` showing Graphology metrics (density, communities, bridge nodes).
- Integrate all three components into the web ops console.
