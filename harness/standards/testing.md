# Testing Standards

> Test pyramid, automation, and coverage requirements.

---

## 1. Test Pyramid & Frameworks
- **Unit Tests (Vitest)**: Fast (<100ms), isolated, hermetic. Verify pure algorithms (`packages/analysis`), policy engines (`packages/policy`), and schema transformations (`packages/schema`). Zero external network dependencies.
- **Integration Tests (Vitest)**: Verify real Cypher queries against FalkorDB Cloud using dedicated environment prefixes (`test_domain`, `test_memory`).
- **Harness Verification (Pytest)**: Fast deterministic linter and breaker checks in `tests/harness/`.

---

## 2. Red-First Discipline
- **Test Author** writes failing unit and integration tests from acceptance criteria before the Builder writes implementation code.
- Red test runs with actual failure outputs must be documented in `harness/artifacts/<TASK-ID>/04-tests.md`.

---

## 3. Coverage & Quality Gates
- **Coverage Floor**: Minimum 80% line coverage on changed or added lines in `packages/*`.
- **Zero Cheating Policy**:
  - Never commit `.skip()`, `todo()`, or `# noqa` / `eslint-disable` to artificially achieve green tests.
  - Never swallow errors in empty `try...catch` blocks.
  - Flaky tests must be quarantined in `docs/memory/lessons.md` and resolved within the active sprint.
