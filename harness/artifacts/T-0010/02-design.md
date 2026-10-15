---
status: complete
owner: designer
task: T-0010
inputs: ["harness/artifacts/T-0010/01-spec.md"]
acceptance_refs: ["AC-011-a", "AC-011-b", "AC-011-c"]
---

# 02-design: Path Animation Sequencer API

## Animation Sequencer Logic
```javascript
export function createPathAnimationSequence(pathNodeIds) {
  // Returns array of step objects:
  // [
  //   { index: 0, currentNode: "A-1", nextNode: "D-17", edgeId: "A-1->D-17" },
  //   { index: 1, currentNode: "D-17", nextNode: null, edgeId: null }
  // ]
}

export function animateEvidencePath(cy, pathNodeIds, { interval = 800, onStep, onComplete }) {
  // Sequentially highlights nodes, pulsates edges, centers viewport on active node,
  // and fires onStep callback.
}
```

## UI Integration
- "ANIMATE PATH" button triggers the playback.
- Subtitle pill appears over the graph canvas displaying the synchronized explanation sentence for the active step.
