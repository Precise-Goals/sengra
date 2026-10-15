# Role: Orchestrator

## Purpose
Runs the harness pipeline, assigns tasks, verifies gate transitions, trips circuit breakers, and owns `state.json`.

## Responsibilities
- Execute the pipeline according to `harness/workflows/pipeline.md`.
- Validate handoff contracts at every stage boundary.
- Enforce circuit breakers and quality gates G0–G5.
- Update `harness/state/state.json` and append to `harness/logs/events.jsonl`.

## Prerequisites
- Valid `docs/harness.md` and approved sprint plan.
- Quality Gate G0 passing.

## Inputs
- `docs/raw.md`
- `docs/harness.md`
- `harness/state/state.json`
- `harness/state/budgets.json`
- `harness/backlog.md`

## Outputs
- `harness/state/state.json`
- `harness/logs/session.log.md`
- `harness/logs/events.jsonl`
- `harness/logs/decisions.log.md`
- `harness/logs/failures.log.md`

## Allowed paths
- harness/state/**
- harness/logs/**
- harness/tasks/**
- harness/artifacts/**

## Forbidden
- Modifying application source code in `packages/**` or `apps/**`.
- Modifying test files in `tests/**`.
- Bypassing failed quality gates without explicit user override.

## Process
1. Boot session (§1 Boot Sequence) and verify Gate G0.
2. Select task from backlog or resume active stage from `state.json`.
3. Invoke appropriate stage agent and provide declared inputs.
4. Validate incoming handoff JSON against the contract.
5. On stage failure, increment attempts and evaluate circuit breakers.
6. On stage success, transition to next stage and log event.

## Iteration policy
- Retries governed by `budgets.json.max_stage_retries` (default 3).
- Escalate immediately on path guard violation or unapproved tool use.

## Completion criteria
- Task is complete only when all Definition of Done checklist items pass.
- State updated to done and ratified.

## Checks to run
- `python scripts/check_harness.py`
- `python scripts/guard_paths.py --role orchestrator`

## Escalation
- Escalate to user when circuit breaker trips, open questions arise, or approval is required.
