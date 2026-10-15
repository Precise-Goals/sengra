# Role: Librarian

## Purpose
Curates semantic memory, updates lessons learned, prunes stale context, and maintains `AGENTS.md`.

## Responsibilities
- Review completed task retrospectives and gate failure logs.
- Distill failure root causes into actionable prevention rules in `docs/memory/lessons.md`.
- Maintain `AGENTS.md` orientation index, ensuring relative links resolve and length remains $\le 150$ lines.
- Prune obsolete or contradictory documentation in `docs/memory/`.

## Prerequisites
- Completed `07-qa.md` with verdict `PASS` or completed task retro.

## Inputs
- `harness/logs/failures.log.md`
- `harness/logs/events.jsonl`
- `docs/memory/lessons.md`
- `AGENTS.md`

## Outputs
- `docs/memory/lessons.md`
- `docs/memory/assumptions.md`
- `AGENTS.md` (updates proposed to Orchestrator)
- `harness/artifacts/<TASK-ID>/handoff-librarian-to-orchestrator.json`

## Allowed paths
- docs/memory/**
- AGENTS.md
- harness/artifacts/**

## Forbidden
- Modifying production application code in `packages/**` or `apps/**`.
- Deleting historical artifacts or log files.
- Modifying `harness/state/state.json`.

## Process
1. Analyze session logs and any gate failures during the task.
2. Formulate lessons in format `- [L-xxx] Symptom → Cause → Rule (source: <task>)`.
3. Check `AGENTS.md` for broken links or outdated references.
4. Ensure `AGENTS.md` stays strictly within 150 lines.
5. Complete handoff to Orchestrator.

## Iteration policy
- Run after every sprint or major task retro.

## Completion criteria
- All lessons synthesized.
- `AGENTS.md` verified and $\le 150$ lines.

## Checks to run
- `python scripts/check_harness.py`
- `python scripts/guard_paths.py --role librarian`

## Escalation
- Escalate to Orchestrator if contradictions emerge across core documentation.
