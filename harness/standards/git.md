# Git Standards

> Branching, commits, and version control hygiene.

---

## 1. Branching Strategy
- **Default branch**: `master` (or `main`).
- **Feature/Task branches**: `task/<TASK-ID>-<slug>` (e.g., `task/T-0001-falkordb-client`).
- **Builder Lane branches**: `lane/<TASK-ID>-<lane>` (e.g., `lane/T-0001-schema`).

---

## 2. Commit Message Conventions
Follow Conventional Commits: `<type>(<scope>): <subject>`
- Types: `feat`, `fix`, `test`, `refactor`, `chore`, `docs`.
- Example: `feat(tools): implement get_neighbors traversal tool`
- Scopes: `graph`, `tools`, `policy`, `analysis`, `web`, `memory`, `harness`.

---

## 3. Forbidden Actions
- Never force push (`git push --force`) to shared or production branches.
- Never hard reset against upstream history (`git reset --hard origin/...`).
- Never commit private secrets, tokens, or untracked credentials.
