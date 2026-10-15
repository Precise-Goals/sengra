# Sprint Execution Template

> Standard ceremony and execution guide for each SENGRA sprint.

---

## 1. Sprint Ceremonies

### Phase 1: Planning
- Select backlog items from [harness/backlog.md](file:///D:/Workspace/Projects/sengra/harness/backlog.md).
- Create task files in `harness/tasks/<ID>.md` using the task template.
- Auto-generate task artifact directories `harness/artifacts/<ID>/` with role skeletons.
- Initialize `harness/state/state.json` with sprint goal, tasks, and stage `spec`.

### Phase 2: Pipeline Execution
- Execute the pipeline per task:
  - Spec $\rightarrow$ Design $\rightarrow$ Plan $\rightarrow$ Tests (Red) $\rightarrow$ Build (Green) $\rightarrow$ Review/Security/Docs $\rightarrow$ QA.
- Validate handoff JSON contracts at every stage boundary.
- Increment attempt counters and evaluate circuit breakers on any failure.

### Phase 3: Review & Exit Gate
- QA runs Gate 4 (full integration suite + AC verification).
- Orchestrator verifies Definition of Done.
- Present sprint demo to user and record approval in [harness/logs/decisions.log.md](file:///D:/Workspace/Projects/sengra/harness/logs/decisions.log.md).

### Phase 4: Sprint Retrospective
- Librarian curates lessons learned in [docs/memory/lessons.md](file:///D:/Workspace/Projects/sengra/docs/memory/lessons.md).
- Update harness configurations, roles, or linters if needed.
- Re-run Gate 0 (`python scripts/check_harness.py && pytest tests/harness`).
