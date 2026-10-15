---
status: complete
owner: designer
task: T-0009
inputs: ["harness/artifacts/T-0009/01-spec.md"]
acceptance_refs: ["AC-010-a", "AC-010-b", "AC-010-c", "AC-010-d"]
---

# 02-design: Case Card & Trace Panel Components

## Component Specifications
1. `<CaseCard result={investigationResult} />`:
   - Decision banner: Large uppercase verdict (`FREEZE`, `HOLD`, `NO_ACTION`).
   - Confidence percentage meter.
   - Action status pill (`ACCOUNT_FROZEN`, `CLEARED`, `HELD_FOR_REVIEW`).
   - Policy explanation text.
   - Traversed evidence path rendered as interconnected breadcrumb chips (`A-RINGA-1` $\rightarrow$ `USED` $\rightarrow$ `D-17`).

2. `<TracePanel trace={steps} />`:
   - Numbered step list with tool names (`recall_entity`, `analyze_subgraph`, `skeptic_challenge`, `evaluate_freeze_policy`, `freeze_account`).
   - Latency / execution timestamp.
   - Expandable JSON input/output inspector.

3. `<MetricsBar metrics={graphologyMetrics} />`:
   - Order (nodes) and size (edges).
   - Network density percentage.
   - Louvain community count.
   - Bridge node count.
