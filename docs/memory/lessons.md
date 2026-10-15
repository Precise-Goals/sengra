# Lessons Learned

> Semantic memory of failure patterns, root causes, and prevention rules.
> Format: `- [L-xxx] Symptom → Cause → Rule (source: <task>, <failure_id>)`

- `[L-001]` Horizontal rules in markdown sections captured by regex $\rightarrow$ `\S` matched markdown syntax dashes $\rightarrow$ Ensure sections requiring emptiness contain only HTML comments or parentheses without horizontal rule syntax (source: T-0000).
- `[L-002]` Secret scanner regex flags reference strings in prompt.md $\rightarrow$ Prompt documentation contains sample test signatures $\rightarrow$ Exclude specification files from live secret regex scans (source: T-0000).
- `[L-003]` Path guard must combine role allow-list with active lane ownership locks to authorize builders on task-assigned root configuration files (source: T-0000).
- `[L-004]` Next.js Turbopack client bundling crashes on native Node socket/crypto dependencies (`falkordb`) $\rightarrow$ Next.js attempts to bundle server graph driver in client bundle $\rightarrow$ Configure `serverExternalPackages: ["falkordb"]` in `next.config.mjs` (source: T-0008).
- `[L-005]` Nested monorepo `.next` directories tracked in git $\rightarrow$ Root `.gitignore` had leading `/` anchor `/apps/web/.next` $\rightarrow$ Use wildcard pattern `**/.next/` without leading anchor in root `.gitignore` (source: T-0008).
- `[L-006]` Deterministic evaluation benchmarks without external LLM API keys $\rightarrow$ CI and unit tests fail if dependent on external Anthropic API $\rightarrow$ Provide offline deterministic execution path in `@sengra/agent` and `@sengra/eval` so benchmark suites run reliably anywhere in $<100$ms (source: T-0012).
- `[L-007]` Duplicate named exports when consolidating tool security guardrails $\rightarrow$ Importing and re-exporting in same module creates identifier collisions $\rightarrow$ Consolidate imports and export maps explicitly at module top level (source: T-0013).

