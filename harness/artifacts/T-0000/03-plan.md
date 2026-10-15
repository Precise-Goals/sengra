---
status: complete
owner: tech-lead
task: T-0000
inputs: ["01-spec.md", "02-design.md"]
acceptance_refs: ["AC-000-a", "AC-000-b", "AC-000-c", "AC-000-d"]
---

# 03-plan: Monorepo & Turborepo Technical Implementation Plan

## 1. Overview & Architecture Context
Task `T-0000` transitions the SENGRA codebase from a single flat Next.js application at the root directory into a high-performance Turborepo monorepo managed with `pnpm` workspaces. This architecture enforces separation of concerns by placing the Next.js web application into `apps/web` and decomposing domain capabilities into modular packages in `packages/*`.

All application packages and web source files follow plain ECMAScript Modules (ESM) with `"type": "module"`, runtime Zod validation, and JSDoc annotations per [docs/raw.md](file:///D:/Workspace/Projects/sengra/docs/raw.md) §7 and [harness/standards/coding.md](file:///D:/Workspace/Projects/sengra/harness/standards/coding.md).

---

## 2. Lane Decomposition & Exclusive File Ownership

Work is assigned to a single builder lane (`monorepo`) to prevent race conditions during root file reorganization.

- **Lane Name**: `monorepo`
- **Owner**: `builder`
- **Lock File**: [harness/state/locks/monorepo.json](file:///D:/Workspace/Projects/sengra/harness/state/locks/monorepo.json)
- **Exclusive Owned Paths**:
  - `package.json` (root workspace manifest)
  - `pnpm-workspace.yaml` (workspace definition)
  - `turbo.json` (turborepo pipeline config)
  - `next.config.ts` (root cleanup)
  - `tsconfig.json` (root cleanup)
  - `next-env.d.ts` (root cleanup)
  - `eslint.config.mjs` (root linting config)
  - `app/**` (root Next.js directory cleanup)
  - `public/**` (root public directory cleanup)
  - `apps/web/**` (relocated Next.js web application)
  - `packages/config/**` (shared config package)
  - `packages/graph/**` (FalkorDB graph package)
  - `packages/schema/**` (Zod schemas package)
  - `packages/tools/**` (MCP tools package)
  - `packages/policy/**` (pure policy rules package)
  - `packages/memory/**` (memory operations package)
  - `packages/analysis/**` (graphology analysis package)
  - `packages/data/**` (synthetic generator package)
  - `packages/agent/**` (agent orchestration package)
  - `packages/ui/**` (shared UI components package)
  - `packages/eval/**` (evaluation runner package)

---

## 3. Step-by-Step Implementation Breakdown

### Step 1: Root Workspace Configuration
1. **Create [pnpm-workspace.yaml](file:///D:/Workspace/Projects/sengra/pnpm-workspace.yaml)**:
   Define the workspace globs:
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```

2. **Create [turbo.json](file:///D:/Workspace/Projects/sengra/turbo.json)**:
   Configure task pipelines for monorepo tasks according to Turborepo schema:
   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "tasks": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": [".next/**", "!.next/cache/**", "dist/**"]
       },
       "lint": {
         "dependsOn": ["^lint"]
       },
       "check-types": {
         "dependsOn": ["^check-types"]
       },
       "test": {
         "dependsOn": ["^build"]
       },
       "test:integration": {
         "cache": false
       },
       "dev": {
         "cache": false,
         "persistent": true
       },
       "seed": {
         "cache": false
       },
       "eval": {
         "cache": false
       }
     }
   }
   ```

3. **Update root [package.json](file:///D:/Workspace/Projects/sengra/package.json)**:
   - Configure root as workspace orchestrator (`"private": true`, `"name": "sengra"`).
   - Define scripts delegating to `turbo`:
     ```json
     {
       "name": "sengra",
       "version": "0.1.0",
       "private": true,
       "type": "module",
       "scripts": {
         "dev": "turbo run dev",
         "build": "turbo run build",
         "lint": "turbo run lint",
         "test": "turbo run test",
         "test:integration": "turbo run test:integration",
         "check-types": "turbo run check-types",
         "format": "prettier --check \"**/*.{js,jsx,json,md,yaml}\"",
         "format:fix": "prettier --write \"**/*.{js,jsx,json,md,yaml}\"",
         "seed": "turbo run seed",
         "eval": "turbo run eval"
       },
       "devDependencies": {
         "turbo": "^2.4.0",
         "prettier": "^3.0.0",
         "eslint": "^9"
       }
     }
     ```
   - Strip application-specific dependencies (`next`, `react`, `react-dom`, `@tailwindcss/turbopack`, `tailwindcss`, `eslint-config-next`) from root; they belong exclusively in `apps/web/package.json`.

---

### Step 2: Relocation of Next.js App to `apps/web/`
1. **Create Directory Structure**:
   - `apps/web/`
   - `apps/web/src/app/`
   - `apps/web/src/components/`
   - `apps/web/src/lib/`
   - `apps/web/public/`

2. **Create [apps/web/package.json](file:///D:/Workspace/Projects/sengra/apps/web/package.json)**:
   - Package name: `"@sengra/web"` (or `"web"`)
   - Module type: `"type": "module"`
   - Private: `true`
   - Dependencies: `next: "16.4.2"`, `react: "19.3.0"`, `react-dom: "19.3.0"`
   - DevDependencies: `@tailwindcss/turbopack: "^4"`, `tailwindcss: "^4"`, `eslint: "^9"`, `eslint-config-next: "16.4.2"`
   - Scripts:
     ```json
     {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     }
     ```

3. **Create [apps/web/next.config.mjs](file:///D:/Workspace/Projects/sengra/apps/web/next.config.mjs)**:
   - Implement plain ESM Next.js configuration:
     ```javascript
     /** @type {import('next').NextConfig} */
     const nextConfig = {
       transpilePackages: [
         "@sengra/graph",
         "@sengra/schema",
         "@sengra/tools",
         "@sengra/policy",
         "@sengra/memory",
         "@sengra/analysis",
         "@sengra/data",
         "@sengra/agent",
         "@sengra/ui",
         "@sengra/eval",
         "@sengra/config"
       ],
       turbopack: {
         rules: {
           "*.css": {
             loaders: ["@tailwindcss/turbopack"],
             as: "*.css"
           }
         }
       }
     };

     export default nextConfig;
     ```

4. **Create [apps/web/jsconfig.json](file:///D:/Workspace/Projects/sengra/apps/web/jsconfig.json)**:
   - Configure editor paths for modern ESM:
     ```json
     {
       "compilerOptions": {
         "target": "ES2022",
         "lib": ["dom", "dom.iterable", "esnext"],
         "allowJs": true,
         "checkJs": false,
         "jsx": "react-jsx",
         "module": "esnext",
         "moduleResolution": "bundler",
         "resolveJsonModule": true,
         "isolatedModules": true,
         "baseUrl": ".",
         "paths": {
           "@/*": ["./src/*"]
         }
       },
       "include": ["src/**/*", "next.config.mjs"]
     }
     ```

5. **Migrate Application Files**:
   - Move `app/favicon.ico` to `apps/web/src/app/favicon.ico`.
   - Move `app/globals.css` to `apps/web/src/app/globals.css`.
   - Convert `app/layout.tsx` to `apps/web/src/app/layout.jsx` (remove TS type annotations, preserve React 19 JSX and styling).
   - Convert `app/page.tsx` to `apps/web/src/app/page.jsx` (remove TS type annotations, preserve placeholder UI).
   - Move files from root `public/*` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) to `apps/web/public/`.
   - Remove root Next.js relics: `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, and root `app/` and `public/` directories once files are moved.

---

### Step 3: Package Skeletons under `packages/*`
Create the 11 package directories under `packages/`. Each package must contain:
1. `package.json` with `"type": "module"`, `"name": "@sengra/<name>"`, `"version": "0.1.0"`, `"main": "./index.js"`, `"exports": { ".": "./index.js" }`.
2. `index.js` exporting an initial stub or default object with JSDoc module header.

#### Package Details:
1. **`packages/config`** (`@sengra/config`):
   - Role: Shared ESLint, Prettier, and code style configurations.
   - Files: `packages/config/package.json`, `packages/config/index.js`.
2. **`packages/graph`** (`@sengra/graph`):
   - Role: FalkorDB client singleton (`globalThis._falkor`), connection caching, and Cypher helpers.
   - Files: `packages/graph/package.json`, `packages/graph/index.js`.
3. **`packages/schema`** (`@sengra/schema`):
   - Role: Zod schemas for graph nodes, edges, tool parameters, and API responses.
   - Files: `packages/schema/package.json`, `packages/schema/index.js`.
4. **`packages/tools`** (`@sengra/tools`):
   - Role: MCP tool implementations (traversal, FalkorDB algorithms, skeptic challenge).
   - Files: `packages/tools/package.json`, `packages/tools/index.js`.
5. **`packages/policy`** (`@sengra/policy`):
   - Role: Pure deterministic decision rules (`FREEZE`, `HOLD`, `NO_ACTION`).
   - Files: `packages/policy/package.json`, `packages/policy/index.js`.
6. **`packages/memory`** (`@sengra/memory`):
   - Role: Recall and record operations against `agent_memory` and `decisions` graphs.
   - Files: `packages/memory/package.json`, `packages/memory/index.js`.
7. **`packages/analysis`** (`@sengra/analysis`):
   - Role: Graphology in-process subgraph analytics (Louvain communities, betweenness, WCC cross-check).
   - Files: `packages/analysis/package.json`, `packages/analysis/index.js`.
8. **`packages/data`** (`@sengra/data`):
   - Role: Deterministic synthetic graph generator and `ground_truth.json` emitter.
   - Files: `packages/data/package.json`, `packages/data/index.js`.
9. **`packages/agent`** (`@sengra/agent`):
   - Role: System prompts, tool calling loop, and flat baseline comparison agent.
   - Files: `packages/agent/package.json`, `packages/agent/index.js`.
10. **`packages/ui`** (`@sengra/ui`):
    - Role: Shared React UI components and Cytoscape canvas wrappers.
    - Files: `packages/ui/package.json`, `packages/ui/index.js`.
11. **`packages/eval`** (`@sengra/eval`):
    - Role: Benchmarking runner comparing baseline flat agent vs graph-native agent.
    - Files: `packages/eval/package.json`, `packages/eval/index.js`.

---

## 4. Acceptance Criteria Mapping

| Acceptance ID | Requirement Ref | Verification Strategy |
|---|---|---|
| `AC-000-a` | `REQ-000` | Verify `pnpm-workspace.yaml` exists and defines `apps/*` and `packages/*`. Verify `turbo.json` exists and parses as valid JSON with pipeline tasks. |
| `AC-000-b` | `REQ-000` | Verify `apps/web/package.json` exists with `"type": "module"`, `apps/web/next.config.mjs` transpiles workspace packages, `apps/web/jsconfig.json` sets `@/*`, and `apps/web/src/app/` contains migrated pages. |
| `AC-000-c` | `REQ-000` | Verify all 11 packages in `packages/*` contain valid `package.json` with `"type": "module"`, `"name": "@sengra/<name>"`, and an `index.js` file. |
| `AC-000-d` | `REQ-000` | Ensure `python scripts/check_harness.py` exits 0 with 0 problems and `pytest tests/harness` exits 0. |

---

## 5. Verification Commands for Builder

The builder should execute the following checks to verify the implementation:

1. **Monorepo Structure Verification**:
   ```powershell
   # Validate pnpm workspace and turbo JSON
   Test-Path pnpm-workspace.yaml
   Test-Path turbo.json
   Get-Content turbo.json | ConvertFrom-Json | Out-Null

   # Validate apps/web structure
   Test-Path apps/web/package.json
   Test-Path apps/web/next.config.mjs
   Test-Path apps/web/jsconfig.json
   Test-Path apps/web/src/app/layout.jsx
   Test-Path apps/web/src/app/page.jsx

   # Validate 11 package skeletons
   $pkgs = @("config", "graph", "schema", "tools", "policy", "memory", "analysis", "data", "agent", "ui", "eval")
   foreach ($p in $pkgs) {
     if (-not (Test-Path "packages/$p/package.json")) { throw "Missing package.json for $p" }
     if (-not (Test-Path "packages/$p/index.js")) { throw "Missing index.js for $p" }
     $json = Get-Content "packages/$p/package.json" | ConvertFrom-Json
     if ($json.type -ne "module") { throw "Package $p is not type: module" }
     if ($json.name -ne "@sengra/$p") { throw "Package $p name mismatch" }
   }
   ```

2. **Quality Gate G0**:
   ```powershell
   python scripts/check_harness.py
   pytest tests/harness
   ```

3. **Path Guard**:
   ```powershell
   python scripts/guard_paths.py --role builder
   ```

---

## 6. Rollback & Contingency Plan
If any step fails or disrupts dependency resolution:
1. Revert uncommitted changes using git:
   ```powershell
   git checkout master -- package.json
   git clean -fd apps/ packages/
   ```
2. Re-verify the harness with `python scripts/check_harness.py`.
