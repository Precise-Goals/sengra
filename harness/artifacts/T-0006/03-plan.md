---
status: complete
owner: tech-lead
task: T-0006
inputs: ["harness/artifacts/T-0006/01-spec.md", "harness/artifacts/T-0006/02-design.md"]
acceptance_refs: ["AC-007-a", "AC-007-b", "AC-007-c", "AC-007-d"]
---

# 03-plan: Implementation Plan for Agent Loop & Streaming Chat

## Lane Decomposition
- Lane: `agent-loop`
- Owned paths:
  - `packages/agent/**`
  - `apps/web/src/app/api/chat/route.js`
  - `tests/unit/test-agent.test.js`

## Plan Steps
1. Write red tests in `tests/unit/test-agent.test.js` verifying:
   - `SYSTEM_PROMPT` presence and rule directives.
   - `createAgentTools` generates AI SDK compatible tools with execution handlers.
   - `runInvestigation` executes end-to-end investigation on Ring A (reaches FREEZE) and Ring B (reaches NO_ACTION).
2. Create lane lock in `harness/state/locks/agent-loop.json`.
3. Implement `packages/agent/src/prompt.js`.
4. Implement `packages/agent/src/tools.js`.
5. Implement `packages/agent/src/orchestrator.js`.
6. Implement `packages/agent/src/index.js`.
7. Implement `apps/web/src/app/api/chat/route.js`.
8. Verify test suite turns 100% green.
