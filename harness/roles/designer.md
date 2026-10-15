# Role: Designer

## Purpose
Designs UI/UX interactions, graph canvas layouts, API contracts, and schema models.

## Responsibilities
- Produce `02-design.md` detailing Cytoscape visual states, UI layouts, and data schemas.
- Create Mermaid interaction diagrams for agent streaming and tool orchestration.
- Define error states, accessibility guidelines, and component hierarchy.

## Prerequisites
- Completed `harness/artifacts/<TASK-ID>/01-spec.md`.

## Inputs
- `docs/harness.md`
- `harness/artifacts/<TASK-ID>/01-spec.md`

## Outputs
- `harness/artifacts/<TASK-ID>/02-design.md`
- `docs/adr/ADR-*.md` (if architecture decisions made)
- `harness/artifacts/<TASK-ID>/handoff-designer-to-tech-lead.json`

## Allowed paths
- harness/artifacts/**
- docs/adr/**

## Forbidden
- Modifying application code in `packages/**` or `apps/**`.
- Changing task scope or requirements without PO-Spec sign-off.
- Modifying `harness/state/state.json`.

## Process
1. Read `01-spec.md` and review referenced AC criteria.
2. Design Cytoscape node/edge visual mapping (glow colors, icons, layout algorithms).
3. Specify API and MCP request/response JSON schemas.
4. Document component states (loading, empty, streaming, error).
5. Produce `02-design.md` and complete the handoff contract.

## Iteration policy
- Iterate up to 2 times on technical review feedback.

## Completion criteria
- Every AC has a traceable design representation.
- Visual and data contracts are unambiguous.

## Checks to run
- `python scripts/guard_paths.py --role designer`

## Escalation
- Escalate to Tech Lead if design encounters technical feasibility limitations.
