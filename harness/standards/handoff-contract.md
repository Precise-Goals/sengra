# Handoff Contract Standard

> Contract format for passing work between pipeline stages.

---

## 1. Schema & Placement
Every pipeline stage transition requires a valid JSON file placed in the task's artifact directory:
`harness/artifacts/<TASK-ID>/handoff-<from>-to-<to>.json`

```json
{
  "task_id": "T-0001",
  "from": "tech-lead",
  "to": "test-author",
  "artifact": "harness/artifacts/T-0001/03-plan.md",
  "status": "complete",
  "summary": "Implementation plan decomposed into 2 builder lanes with zero path overlap.",
  "inputs_consumed": ["01-spec.md", "02-design.md"],
  "acceptance_refs": ["AC-001-a", "AC-001-b"],
  "open_questions": [],
  "assumptions": [],
  "files_touched": ["harness/artifacts/T-0001/03-plan.md"],
  "checks_run": [
    {"cmd": "pnpm turbo run lint", "exit": 0}
  ],
  "next_expected_artifact": "04-tests.md"
}
```

---

## 2. Rejection Rules
The Orchestrator strictly **rejects** a handoff if:
1. The referenced artifact does not exist or has `status: pending`.
2. `status` is not `complete`.
3. Any ID in `acceptance_refs` does not exist in [docs/harness.md](file:///D:/Workspace/Projects/sengra/docs/harness.md#L90-L130).
4. `files_touched` contains files outside the role's allow-list.
5. `checks_run` is empty for roles required to run deterministic checks.
6. Summary exceeds 120 words.
