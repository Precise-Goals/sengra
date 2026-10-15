# Definition of Done Standard

> Global verification criteria for SENGRA features, tasks, and sprints.

---

## 1. Global Criteria

A task or stage is **Done** if and only if all deterministic gates pass:

- [ ] **Artifacts complete**: Artifacts `01-spec.md` through `08-docs.md` exist and all stage handoff JSONs validate per contract.
- [ ] **Deterministic gates pass**:
  - **G0 Harness**: `python scripts/check_harness.py && pytest tests/harness` exits 0.
  - **G1 Lane**: Format, lint, typecheck, and lane unit tests pass.
  - **G2 Merge**: Full unit test suite passes with coverage $\ge 80\%$ on changed lines.
  - **G3 Review**: 0 `BLOCKER`/`MAJOR` review issues, 0 high/critical security findings, 0 detected secrets.
  - **G4 QA**: All acceptance criteria (`AC-*`) verified with passing tests or recorded manual evidence.
  - **G5 Sprint**: Demo checklist verified and human approval recorded.
- [ ] **Evidence logged**: All commands and exit codes recorded in [harness/logs/events.jsonl](file:///D:/Workspace/Projects/sengra/harness/logs/events.jsonl).
- [ ] **No cheating**: 0 skipped tests (`test.skip`), 0 blanket lint disables, 0 unhandled caught errors.
- [ ] **Clean state & git**: State updated in `harness/state/state.json`, commit conforms to [harness/standards/git.md](file:///D:/Workspace/Projects/sengra/harness/standards/git.md), path guard clean.
- [ ] **Memory updated**: Lessons learned logged in [docs/memory/lessons.md](file:///D:/Workspace/Projects/sengra/docs/memory/lessons.md); [AGENTS.md](file:///D:/Workspace/Projects/sengra/AGENTS.md) remains accurate and $\le 150$ lines.
