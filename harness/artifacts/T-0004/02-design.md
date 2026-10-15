---
status: complete
owner: designer
task: T-0004
inputs: ["01-spec.md"]
acceptance_refs: ["AC-003-a", "AC-003-b", "AC-005-a", "AC-005-b", "AC-008-a"]
---

# 02-design: Analysis and Policy Function Signatures

## Graphology Analysis API
```javascript
export function analyzeSubgraph(nodes, edges) {
  // Returns: { communities, betweenness, components, density, bridgeNodes }
}
```

## Policy Engine API
```javascript
export function evaluateFreezePolicy(context) {
  // Returns: { decision: "FREEZE" | "HOLD" | "NO_ACTION", confidence, policy, explanation, evidencePath }
}

export function skepticCheck(cluster) {
  // Returns: { isBenign: boolean, reason?: string }
}
```
