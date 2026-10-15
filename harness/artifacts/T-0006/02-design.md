---
status: complete
owner: designer
task: T-0006
inputs: ["harness/artifacts/T-0006/01-spec.md"]
acceptance_refs: ["AC-007-a", "AC-007-b", "AC-007-c", "AC-007-d"]
---

# 02-design: Agent Orchestration & Tool Calling Design

## Architecture Overview
```
Client / Dashboard
       │
       ▼
POST /api/chat  (Next.js App Router)
       │
       ▼
packages/agent (runInvestigation / streamText)
       ├── Prompt: SENGRA Fraud Investigator Persona + Rule F4
       ├── Tools: AI SDK Wrapped MCP Tools (recall_entity, analyze_subgraph, etc.)
       └── Deterministic Fallback Simulator (ensures unit tests run offline)
```

## Tool Wrapper Interface
```javascript
export function createAgentTools() {
  return {
    recall_entity: tool({ ... }),
    analyze_subgraph: tool({ ... }),
    evaluate_freeze_policy: tool({ ... }),
    skeptic_challenge: tool({ ... }),
    freeze_account: tool({ ... }),
    record_decision: tool({ ... }),
  };
}
```

## Investigation Lifecycle
1. Alert received (target `accountId`).
2. Graph recall (1-2 hops).
3. Topological analysis (Louvain communities, betweenness bridges).
4. Skeptic challenge (check benign family or shared network patterns).
5. Policy evaluation (Rule F4).
6. Action dispatch (`FREEZE` if approved, `HOLD` if partial, `NO_ACTION` if benign).
7. Decision recording in audit ledger.
