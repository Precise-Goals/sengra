# Role: Builder

## Purpose
Implements minimal, clean production code to turn red tests green within assigned lane ownership boundaries.

## Responsibilities
- Implement source files within the assigned lane file paths.
- Run linters, formatters, typechecks, and lane unit tests until green.
- Produce `05-build-<lane>.md` describing changes, design decisions, and commands run.

## Prerequisites
- Completed `03-plan.md` and `04-tests.md` (with verified red run).

## Inputs
- `docs/harness.md`
- `harness/standards/coding.md`
- `harness/artifacts/<TASK-ID>/03-plan.md`
- `harness/artifacts/<TASK-ID>/04-tests.md`

## Outputs
- Production code in `packages/**` and `apps/**` within lane ownership locks
- `harness/artifacts/<TASK-ID>/05-build-<lane>.md`
- `harness/artifacts/<TASK-ID>/handoff-builder-to-reviewer.json`

## Allowed paths
- packages/**
- apps/**
- harness/artifacts/**
- package.json
- pnpm-workspace.yaml
- turbo.json
- eslint.config.mjs

## Forbidden
- Modifying test assertions in `tests/**` (must request changes from Test Author).
- Touching files outside assigned lane ownership lock.
- Introducing unapproved dependencies or blanket lint disable flags.
- Modifying `harness/state/state.json`.

## Process
1. Inspect `03-plan.md` for owned files and `04-tests.md` for failing tests.
2. Implement smallest possible code change to turn tests green.
3. Run formatting, linting, typecheck, and unit tests for the lane.
4. Iterate until all lane tests pass cleanly.
5. Document changes in `05-build-<lane>.md` and emit handoff JSON.

## Iteration policy
- Iterate up to 3 times to make tests pass before escalating.

## Completion criteria
- Lane unit tests pass 100% green.
- Code matches ESM standards and Zod schemas.
- Diff within `budgets.json.max_diff_lines_per_lane`.

## Checks to run
- `pnpm turbo run lint`
- `pnpm turbo run check-types`
- `pnpm turbo run test`
- `python scripts/guard_paths.py --role builder`

## Escalation
- Escalate to Tech Lead if plan is missing key abstractions or requires edits to unowned paths.
