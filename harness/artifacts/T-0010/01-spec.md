---
status: complete
owner: po-spec
task: T-0010
inputs: ["harness/tasks/T-0010.md", "docs/harness.md"]
acceptance_refs: ["AC-011-a", "AC-011-b", "AC-011-c"]
---

# 01-spec: Animated Graph Evidence Path Synchronization

## Problem Statement
Static graph displays require the investigator to manually hunt for nodes mentioned in an explanation text. Synchronizing the animated highlight of nodes and edges with the spoken or streamed explanation sentence transforms complex fraud ring evidence into an intuitive, demonstrative presentation.

## Scope
- Implement `createPathAnimationSequence(pathNodeIds)` utility.
- Implement `animateEvidencePath(cy, pathNodeIds, options)` with step callbacks.
- Integrate interactive playback button and animated subtitle banner into the UI.
