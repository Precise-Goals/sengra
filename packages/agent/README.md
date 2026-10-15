# @sengra/agent

Autonomous fraud investigation agent loop powered by Vercel AI SDK, Claude 3.5 Sonnet, and graph topological tools.

## Architecture

```
Alert Ingestion
      │
      ▼
SYSTEM_PROMPT (Persona, Graph Traversal, Skeptic Challenge, Rule F4)
      │
      ├── Tool 1: recall_entity (fetch 1-2 hop neighborhood)
      ├── Tool 2: analyze_subgraph (Louvain communities, betweenness)
      ├── Tool 3: skeptic_challenge (evaluate benign explanations)
      ├── Tool 4: evaluate_freeze_policy (enforce Rule F4)
      └── Tool 5: freeze_account / record_decision (action & audit)
```

## Usage
```javascript
import { runInvestigation, createAgentTools, SYSTEM_PROMPT } from "@sengra/agent";

// Run autonomous multi-step investigation
const result = await runInvestigation({
  accountId: "ACC_MULE_1",
  subgraph: { nodes, edges },
  flaggedInComponent: 5,
  hopsToBadDevice: 1,
});

console.log(result.decision); // "FREEZE"
console.log(result.trace);    // Detailed execution log
```
