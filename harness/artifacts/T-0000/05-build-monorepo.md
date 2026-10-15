---
status: complete
owner: builder
task: T-0000
lane: monorepo
inputs: ["03-plan.md", "04-tests.md"]
acceptance_refs: ["AC-000-a", "AC-000-b", "AC-000-c", "AC-000-d"]
---

# 05-build-monorepo: Monorepo & Turborepo Implementation Record

## 1. Summary of Changes
Executed the transition of SENGRA from a flat root Next.js project into a Turborepo monorepo orchestrated with pnpm workspaces. All requirements per `harness/artifacts/T-0000/03-plan.md` have been implemented cleanly within the assigned `monorepo` builder lane.

---

## 2. Step 1: Root Workspace Configuration
1. **[pnpm-workspace.yaml](file:///D:/Workspace/Projects/sengra/pnpm-workspace.yaml)**:
   - Configured workspace package globs:
     ```yaml
     packages:
       - "apps/*"
       - "packages/*"
     ```
2. **[turbo.json](file:///D:/Workspace/Projects/sengra/turbo.json)**:
   - Created pipeline definition specifying tasks: `build`, `lint`, `check-types`, `test`, `test:integration`, `dev`, `seed`, `eval`.
3. **[package.json](file:///D:/Workspace/Projects/sengra/package.json)**:
   - Updated packageManager to `pnpm@9.15.4`.
   - Delegated scripts to Turbo (`dev`, `build`, `lint`, `test`, `test:integration`, `check-types`, `format`, `format:fix`, `seed`, `eval`).
   - Removed application-specific dependencies from root to keep it lean.
4. **[eslint.config.mjs](file:///D:/Workspace/Projects/sengra/eslint.config.mjs)**:
   - Configured root ESLint using standard flat config with global ignores.

---

## 3. Step 2: Relocation of Web App to `apps/web/`
1. **[apps/web/package.json](file:///D:/Workspace/Projects/sengra/apps/web/package.json)**:
   - Configured `"name": "@sengra/web"`, `"private": true`, `"type": "module"`.
   - Added dependencies: `next`, `react`, `react-dom`, `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`.
   - Added devDependencies: `@tailwindcss/turbopack`, `tailwindcss`, `eslint`, `eslint-config-next`.
2. **[apps/web/next.config.mjs](file:///D:/Workspace/Projects/sengra/apps/web/next.config.mjs)**:
   - Configured ESM Next.js configuration with `transpilePackages` for all workspace packages (`@sengra/graph`, `@sengra/schema`, `@sengra/tools`, `@sengra/policy`, `@sengra/memory`, `@sengra/analysis`, `@sengra/data`, `@sengra/agent`, `@sengra/ui`, `@sengra/eval`, `@sengra/config`).
   - Configured Turbopack CSS loader rule for `@tailwindcss/turbopack`.
3. **[apps/web/jsconfig.json](file:///D:/Workspace/Projects/sengra/apps/web/jsconfig.json)**:
   - Configured `@/*` path mapping to `./src/*`.
4. **[apps/web/eslint.config.mjs](file:///D:/Workspace/Projects/sengra/apps/web/eslint.config.mjs)**:
   - Configured Next.js core web vitals linting.
5. **Migrated Source Files**:
   - `apps/web/src/app/layout.jsx`: Converted root layout to plain JavaScript ESM.
   - `apps/web/src/app/page.jsx`: Converted root home page to plain JavaScript ESM.
   - `apps/web/src/app/globals.css`: Migrated stylesheet with Tailwind CSS theme configuration.
   - `apps/web/src/app/favicon.ico`: Migrated favicon.
   - `apps/web/public/`: Migrated public SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).
6. **Root Directory Cleanup**:
   - Removed obsolete root `app/`, `public/`, `next.config.ts`, `tsconfig.json`, and `next-env.d.ts`.

---

## 4. Step 3: Package Skeletons (`packages/*`)
Created all 11 modular packages with `"type": "module"`, `"version": "0.1.0"`, `"main": "./src/index.js"`, and JSDoc module headers:

1. **`@sengra/config`** ([packages/config/package.json](file:///D:/Workspace/Projects/sengra/packages/config/package.json), [packages/config/src/index.js](file:///D:/Workspace/Projects/sengra/packages/config/src/index.js)): Shared ESLint/Prettier configs.
2. **`@sengra/graph`** ([packages/graph/package.json](file:///D:/Workspace/Projects/sengra/packages/graph/package.json), [packages/graph/src/index.js](file:///D:/Workspace/Projects/sengra/packages/graph/src/index.js)): FalkorDB client singleton (`getDb`), connection caching, and graph accessors (`domain`, `agentMemory`, `decisions`).
3. **`@sengra/schema`** ([packages/schema/package.json](file:///D:/Workspace/Projects/sengra/packages/schema/package.json), [packages/schema/src/index.js](file:///D:/Workspace/Projects/sengra/packages/schema/src/index.js)): Zod schemas and JSDoc typedefs for nodes and edges.
4. **`@sengra/tools`** ([packages/tools/package.json](file:///D:/Workspace/Projects/sengra/packages/tools/package.json), [packages/tools/src/index.js](file:///D:/Workspace/Projects/sengra/packages/tools/src/index.js)): MCP tool registry and tool inventory list.
5. **`@sengra/policy`** ([packages/policy/package.json](file:///D:/Workspace/Projects/sengra/packages/policy/package.json), [packages/policy/src/index.js](file:///D:/Workspace/Projects/sengra/packages/policy/src/index.js)): Pure deterministic decision rules (`evaluatePolicy`, `DECISION_ACTIONS`).
6. **`@sengra/memory`** ([packages/memory/package.json](file:///D:/Workspace/Projects/sengra/packages/memory/package.json), [packages/memory/src/index.js](file:///D:/Workspace/Projects/sengra/packages/memory/src/index.js)): Recall and record operations (`recallEntity`, `recordDecision`).
7. **`@sengra/analysis`** ([packages/analysis/package.json](file:///D:/Workspace/Projects/sengra/packages/analysis/package.json), [packages/analysis/src/index.js](file:///D:/Workspace/Projects/sengra/packages/analysis/src/index.js)): Pure Graphology in-process subgraph analytics stub (`analyzeSubgraph`).
8. **`@sengra/data`** ([packages/data/package.json](file:///D:/Workspace/Projects/sengra/packages/data/package.json), [packages/data/src/index.js](file:///D:/Workspace/Projects/sengra/packages/data/src/index.js)): Synthetic graph generator (`generateSyntheticData`).
9. **`@sengra/agent`** ([packages/agent/package.json](file:///D:/Workspace/Projects/sengra/packages/agent/package.json), [packages/agent/src/index.js](file:///D:/Workspace/Projects/sengra/packages/agent/src/index.js)): System prompts and agent loop orchestration stub (`SYSTEM_PROMPT`, `createAgentLoop`).
10. **`@sengra/ui`** ([packages/ui/package.json](file:///D:/Workspace/Projects/sengra/packages/ui/package.json), [packages/ui/src/index.js](file:///D:/Workspace/Projects/sengra/packages/ui/src/index.js)): Shared UI components skeleton.
11. **`@sengra/eval`** ([packages/eval/package.json](file:///D:/Workspace/Projects/sengra/packages/eval/package.json), [packages/eval/src/index.js](file:///D:/Workspace/Projects/sengra/packages/eval/src/index.js)): Evaluation runner and benchmark metric calculators (`computeMetrics`).

---

## 5. Verification Commands Executed

```powershell
# 1. Monorepo Structure and Package Integrity Validation
$pkgs = @("config", "graph", "schema", "tools", "policy", "memory", "analysis", "data", "agent", "ui", "eval")
foreach ($p in $pkgs) {
  if (-not (Test-Path "packages/$p/package.json")) { throw "Missing package.json for $p" }
  if (-not (Test-Path "packages/$p/index.js")) { throw "Missing index.js for $p" }
  if (-not (Test-Path "packages/$p/src/index.js")) { throw "Missing src/index.js for $p" }
  $json = Get-Content "packages/$p/package.json" | ConvertFrom-Json
  if ($json.type -ne "module") { throw "Package $p is not type: module" }
  if ($json.name -ne "@sengra/$p") { throw "Package $p name mismatch" }
  if ($json.main -ne "./src/index.js") { throw "Package $p main mismatch" }
}
# Output: ALL 11 PACKAGES AND MONOREPO CONFIG VERIFIED OK

# 2. Quality Gate G0 Verification
python scripts/check_harness.py
# Output: OK - 0 problem(s)

pytest tests/harness
# Output: 21 passed in 0.28s
```

All acceptance criteria `AC-000-a`, `AC-000-b`, `AC-000-c`, `AC-000-d` are satisfied.
