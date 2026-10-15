---
status: complete
owner: builder
task: T-0006
inputs: ["harness/artifacts/T-0006/03-plan.md", "harness/artifacts/T-0006/04-tests.md"]
acceptance_refs: ["AC-007-a", "AC-007-b", "AC-007-c", "AC-007-d"]
---

# 05-build: Agent Loop & Streaming Chat Implementation

## Changes Implemented
1. `packages/agent/src/prompt.js`:
   - Authored `SYSTEM_PROMPT` establishing the SENGRA Fraud Investigator persona, autonomous graph neighborhood expansion, Skeptic challenge protocol for benign family clusters, and strict Rule F4 policy gating.
2. `packages/agent/src/tools.js`:
   - Converted 11 MCP fraud tools into Vercel AI SDK `tool()` instances with Zod schema definitions and async executors delegating to `@sengra/tools`.
3. `packages/agent/src/orchestrator.js`:
   - Implemented `runInvestigation(context)` performing multi-step graph exploration, Louvain topological analytics, Skeptic challenge checks, and Rule F4 freeze policy gating with step-by-step trace generation.
4. `packages/agent/src/index.js`:
   - Exported `SYSTEM_PROMPT`, `createAgentTools`, and `runInvestigation`.
5. `apps/web/src/app/api/chat/route.js`:
   - Next.js App Router streaming endpoint supporting live Claude 3.5 Sonnet streaming via Vercel AI SDK when `ANTHROPIC_API_KEY` is set, and falling back gracefully to deterministic multi-step investigation orchestrator for offline environments.
