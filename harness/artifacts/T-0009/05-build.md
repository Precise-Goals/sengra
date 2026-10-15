---
status: complete
owner: builder
task: T-0009
inputs: ["harness/artifacts/T-0009/03-plan.md", "harness/artifacts/T-0009/04-tests.md"]
acceptance_refs: ["AC-010-a", "AC-010-b", "AC-010-c", "AC-010-d"]
---

# 05-build: Live Trace Panel & Case Report Card Implementation

## Changes Implemented
1. `packages/ui/src/case-card.jsx`:
   - Built `<CaseCard />` displaying decision badge (`FREEZE`, `HOLD`, `NO_ACTION`), confidence gauge, target account, human-readable policy justification, and interactive evidence graph path breadcrumb chips.
   - Built `getVerdictStyle(verdict)` mapping verdicts to distinct color cues.
2. `packages/ui/src/trace-panel.jsx`:
   - Built `<TracePanel />` displaying numbered list of executed tools with `SUCCESS` badges, timestamps, and expandable JSON input/output inspection drawers.
   - Built `formatTraceSteps(rawTrace)`.
3. `packages/ui/src/metrics-bar.jsx`:
   - Built `<MetricsBar />` calculating and displaying graph order, size, density, Louvain communities, and bridge node count.
4. `packages/ui/src/index.js`:
   - Exported all new components and helpers.
5. `apps/web/src/app/page.jsx`:
   - Integrated `MetricsBar`, `CaseCard`, and `TracePanel` into the dark ops console.
