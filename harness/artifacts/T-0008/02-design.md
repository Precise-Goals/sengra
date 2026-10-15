---
status: complete
owner: designer
task: T-0008
inputs: ["harness/artifacts/T-0008/01-spec.md"]
acceptance_refs: ["AC-009-a", "AC-009-b", "AC-009-c"]
---

# 02-design: Console Layout & Cytoscape Styles

## Color Palette (Dark Cyberpunk / Ops Console)
- Background: `#09090b` (zinc-950)
- Surface / Panels: `#18181b` (zinc-900), border `#27272a`
- Account Nodes: `#38bdf8` (sky-400)
- Device Nodes: `#a855f7` (purple-500)
- Known Bad Device: `#ef4444` (red-500, animated pulse)
- Address Nodes: `#f59e0b` (amber-500)
- Card Nodes: `#10b981` (emerald-500)
- Edges: `#52525b` (zinc-600) with arrowheads

## Cytoscape Canvas API
```javascript
<GraphCanvas
  elements={cytoscapeElements}
  layout={{ name: "concentric" }}
  onNodeSelect={(node) => handleSelect(node)}
  highlightedPath={["A-1", "D-17"]}
/>
```
