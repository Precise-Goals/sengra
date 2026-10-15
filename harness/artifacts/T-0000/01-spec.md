---
status: pending
owner: po-spec
task: T-0000
inputs: ["harness/tasks/T-0000.md", "docs/harness.md"]
acceptance_refs: ["AC-000-a", "AC-000-b", "AC-000-c", "AC-000-d"]
---

# 01-spec: Monorepo & Turborepo Setup

## Problem Statement
The repository was initialized as a single Next.js project at the root level, whereas SENGRA's architecture requires a Turborepo monorepo with `apps/web` and multiple modular packages in `packages/*` (`@sengra/graph`, `@sengra/schema`, `@sengra/tools`, `@sengra/policy`, etc.).

## Scope
- Configure `pnpm-workspace.yaml` and `turbo.json`.
- Restructure Next.js web application into `apps/web/`.
- Create package skeletons under `packages/*` with `"type": "module"`.

## Acceptance Criteria Mapping
- `AC-000-a`: Valid `pnpm-workspace.yaml` and `turbo.json`.
- `AC-000-b`: `apps/web/` contains the web application.
- `AC-000-c`: Skeletons for packages in `packages/*`.
- `AC-000-d`: G0 gate green.
