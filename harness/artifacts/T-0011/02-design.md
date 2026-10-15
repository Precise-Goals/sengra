---
status: complete
owner: designer
task: T-0011
inputs: ["harness/artifacts/T-0011/01-spec.md"]
acceptance_refs: ["AC-012-a", "AC-012-b", "AC-012-c"]
---

# 02-design: Flat-Table Baseline Agent Design

## Tabular Record Interface
```javascript
{
  accountId: "ACC_001",
  balance: 4500,
  txCount24h: 8,
  directDeviceId: "DEV_01",
  directDeviceKnownBad: false,
  sharedIpCount: 5,            // Naive rule triggers on this!
  sharedAddressCount: 5        // Naive rule triggers on this!
}
```

## Baseline Rule Logic
```javascript
export function evaluateBaseline(row) {
  // Rule B1: Direct bad device -> FREEZE
  // Rule B2: Shared IP with >= 3 accounts -> Naive FREEZE (Causes Ring B false positive!)
  // Fails on Ring A: If distance to bad device > 1 hop, directDeviceKnownBad is false -> NO_ACTION (Causes Ring A false negative!)
}
```
