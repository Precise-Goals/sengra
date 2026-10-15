---
status: pending
owner: designer
task: T-0000
inputs: ["01-spec.md"]
acceptance_refs: ["AC-000-a", "AC-000-b", "AC-000-c", "AC-000-d"]
---

# 02-design: Monorepo Architecture

## Workspace Layout
- `apps/web`: Next.js 16 application
- `packages/config`: Shared configurations (eslint, prettier)
- `packages/graph`: FalkorDB connection module
- `packages/schema`: Zod schemas & types
- `packages/tools`: MCP tools
- `packages/policy`: Pure policy rules
- `packages/memory`: Memory store
- `packages/analysis`: Graphology analytics
- `packages/data`: Seed data generator
- `packages/agent`: Agent loop & baseline
- `packages/ui`: Shared React components
- `packages/eval`: Metrics evaluation
