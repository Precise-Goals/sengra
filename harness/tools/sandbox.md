# Sandbox Rules — Bash & Code Execution

> Execution constraints governing automated tasks and shell commands.

---

## 1. Scope & Isolation
- All commands execute strictly within the repository workspace root (`D:\Workspace\Projects\sengra`) and system temp directories.
- Never access user home directories, system system directories, or unrelated repositories.
- Worktree directories for parallel builder lanes must follow `lane/<TASK-ID>-<lane>`.

---

## 2. Permitted Commands
Only canonical commands listed in [docs/harness.md](file:///D:/Workspace/Projects/sengra/docs/harness.md#L190-L210) §8 are permitted:
- `pnpm install`, `pnpm turbo run lint`, `pnpm prettier --check ...`
- `pnpm turbo run check-types`, `pnpm turbo run test`, `pnpm turbo run build`
- `python scripts/check_harness.py && pytest tests/harness`
- `pnpm seed`, `pnpm seed:reset`, `pnpm eval`
- Read-only shell inspection: `ls`, `cat`, `grep`, `git status`, `git diff`, `git log`.

---

## 3. Network & Safety Policies
- No network access except to allow-listed registries (npm) and FalkorDB Cloud endpoints.
- No `curl | sh` or arbitrary remote script piping.
- No `rm -rf` outside build cache directories (`.next`, `dist`, `node_modules/.cache`).
- No administrative escalation (`sudo`, elevated shells).
- Secrets redaction: never echo, print, or commit `ANTHROPIC_API_KEY`, `FALKORDB_PASSWORD`, or `MCP_SHARED_SECRET`.

---

## 4. Budgets & Timeouts
- Per-command timeout: default 120 seconds.
- Session wall-clock budget governed by [harness/state/budgets.json](file:///D:/Workspace/Projects/sengra/harness/state/budgets.json).
- Every command and its exit code must be recorded in [harness/logs/events.jsonl](file:///D:/Workspace/Projects/sengra/harness/logs/events.jsonl).
