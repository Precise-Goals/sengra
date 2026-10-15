# @sengra/memory

Cross-session memory persistence and audit trail management for SENGRA.

## Overview
Stores investigation history, cases, clearances, and decisions across two FalkorDB graphs:
- `agent_memory`: Stores `:Case` entities, open alerts, and historical investigation context.
- `decisions`: Stores `:Decision` nodes with evidence paths, confidence metrics, and policies.

## Features
- **Cross-Session Recall**: `findPastInvestigations(entityId)` enables subsequent sessions to cite prior investigations, preventing redundant work and protecting cleared family accounts.
- **Dual-Mode Persistence**: Automatically writes to FalkorDB when connected, while maintaining a synchronized in-memory fallback store for offline development and fast unit testing.
- **Parameterized Security**: 100% of Cypher database queries use parameterized argument bindings.

## API
```javascript
import { saveCase, saveDecision, findPastInvestigations } from "@sengra/memory";

// Session 1: Save case and decision
await saveCase({ caseId: "CASE_001", title: "Ring Investigation", target: "ACC_001" });
await saveDecision({ id: "DEC_001", target: "ACC_001", decision: "FREEZE", confidence: 0.95 });

// Session 2: Recall prior findings
const history = await findPastInvestigations("ACC_001");
// history[0].decision === "FREEZE"
```
