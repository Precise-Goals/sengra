---
status: complete
owner: designer
task: T-0007
inputs: ["harness/artifacts/T-0007/01-spec.md"]
acceptance_refs: ["AC-008-a", "AC-008-b", "AC-008-c", "AC-008-d"]
---

# 02-design: Memory API & Graph Schema Design

## Graph Schemas
1. Graph `agent_memory`:
   - Node `:Case { id, title, severity, status, target, createdAt, updatedAt }`
   - Node `:Finding { id, text, type, createdAt }`
   - Edge `(:Case)-[:HAS_FINDING]->(:Finding)`
   - Edge `(:Case)-[:INVESTIGATED]->(:Account)`
2. Graph `decisions`:
   - Node `:Decision { id, target, decision, confidence, policy, explanation, evidencePath, timestamp }`

## Memory API
```javascript
export async function saveCase(caseData) { ... }
export async function getCase(caseId) { ... }
export async function saveDecision(decisionData) { ... }
export async function getDecisionsForEntity(entityId) { ... }
export async function findPastInvestigations(entityId) { ... }
```
