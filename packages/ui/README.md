# @sengra/ui

High-contrast dark mode Cytoscape.js visualization components and styles for SENGRA.

## Visual Encoding Palette
- **Account**: `#38bdf8` (sky-400, circle)
- **Device**: `#a855f7` (purple-500, rounded rectangle)
- **Known Bad Device (D-17)**: `#ef4444` (red-500, larger threat node)
- **Address**: `#f59e0b` (amber-500, hexagon)
- **Card**: `#10b981` (emerald-500, diamond)
- **IP Address**: `#06b6d4` (cyan-500, small node)
- **Highlighted Edge**: `#ef4444` (width 3.5px with glow)

## Usage
```jsx
import { GraphCanvas, toCytoscapeElements } from "@sengra/ui";

const elements = toCytoscapeElements(nodes, edges);

export function MyConsole() {
  return (
    <GraphCanvas
      elements={elements}
      layoutName="concentric"
      onNodeClick={(node) => console.log(node)}
      highlightedNodeIds={["A-1", "D-17"]}
    />
  );
}
```
