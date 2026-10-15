---
status: complete
owner: scribe
task: T-0000
inputs: ["harness/artifacts/T-0000/05-build.md"]
acceptance_refs: ["AC-000-a", "AC-000-b", "AC-000-c", "AC-000-d"]
---

# 08-docs: Monorepo Documentation Updates

## 1. Documentation Changes
- Updated repository structure documentation in [README.md](file:///D:/Workspace/Projects/sengra/README.md) to reflect Turborepo monorepo with `apps/web/` and `packages/*`.
- Verified [AGENTS.md](file:///D:/Workspace/Projects/sengra/AGENTS.md) layout section matches the active directory tree.
- Verified all canonical commands in [docs/harness.md](file:///D:/Workspace/Projects/sengra/docs/harness.md#L190-L210) §8 are configured in the root `package.json`.

## 2. Workspace Packages Inventory
Documented all 11 workspace packages:
1. `@sengra/config`: Shared configuration.
2. `@sengra/graph`: FalkorDB connection module and query runners.
3. `@sengra/schema`: Zod schemas and JSDoc entity models.
4. `@sengra/tools`: MCP tool catalog and implementations.
5. `@sengra/policy`: Pure deterministic decision rules.
6. `@sengra/memory`: Cross-session memory recall and recording.
7. `@sengra/analysis`: In-process Graphology subgraph analytics.
8. `@sengra/data`: Synthetic graph generator and ground truth.
9. `@sengra/agent`: System prompts and agent loop orchestration.
10. `@sengra/ui`: Shared React components.
11. `@sengra/eval`: Evaluation benchmark metrics runner.

## 3. Link Integrity
- Checked relative markdown links in `AGENTS.md`, `CLAUDE.md`, and `harness/artifacts/T-0000/*.md`.
- All relative links resolve to existing files.
