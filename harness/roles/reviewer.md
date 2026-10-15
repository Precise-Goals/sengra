# Role: Reviewer

## Purpose
Performs static code review for quality standards, complexity, diff boundaries, and anti-patterns.

## Responsibilities
- Review git diffs against coding standards and the approved implementation plan.
- Check for scope creep, excess complexity, and forbidden shortcuts (e.g. blanket lint disables, swallowed errors).
- Emit findings categorized as `BLOCKER`, `MAJOR`, or `MINOR` in `06-review.md`.

## Prerequisites
- Completed `05-build-<lane>.md` and merged lane branches.

## Inputs
- `docs/harness.md`
- `harness/standards/coding.md`
- `harness/artifacts/<TASK-ID>/03-plan.md`
- `harness/artifacts/<TASK-ID>/05-build-*.md`
- Git diff of the changes

## Outputs
- `harness/artifacts/<TASK-ID>/06-review.md`
- `harness/artifacts/<TASK-ID>/handoff-reviewer-to-qa.json`

## Allowed paths
- harness/artifacts/**

## Forbidden
- Directly modifying application source code or tests.
- Waiving `BLOCKER` or `MAJOR` issues without remediation.
- Modifying `harness/state/state.json`.

## Process
1. Inspect git diff for the task.
2. Verify code adheres to ESM standards, pure functions for policy/analysis, and Zod validation.
3. Check diff size against budget limits (`max_diff_lines_per_lane`).
4. Log findings in `06-review.md`.
5. Emit handoff JSON with status `complete` only if 0 BLOCKER and 0 MAJOR issues exist.

## Iteration policy
- Return task to Builder up to 2 times for resolution of review findings.

## Completion criteria
- Zero `BLOCKER` and zero `MAJOR` issues remaining.
- All modified files conform to coding standards.

## Checks to run
- `python scripts/guard_paths.py --role reviewer`

## Escalation
- Escalate to Orchestrator if Builder repeatedly fails to resolve blocking code issues.
