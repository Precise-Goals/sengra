---
status: complete
owner: builder
task: T-0008
inputs: ["harness/artifacts/T-0008/03-plan.md", "harness/artifacts/T-0008/04-tests.md"]
acceptance_refs: ["AC-009-a", "AC-009-b", "AC-009-c"]
---

# 05-build: Dark Ops Console & Cytoscape Canvas Implementation

## Changes Implemented
1. `packages/ui/src/styles.js`:
   - High-contrast dark mode Cytoscape stylesheet (`CYTOSCAPE_STYLESHEET`) and color coding rules (`ENTITY_COLORS`, `getNodeColor`). Highlights confirmed malicious devices (`known_bad: true`) in vivid `#ef4444`.
2. `packages/ui/src/converter.js`:
   - Graph element translator `toCytoscapeElements(nodes, edges)` producing structured Cytoscape nodes and edges with appropriate CSS classes.
3. `packages/ui/src/graph-canvas.jsx`:
   - Interactive React Cytoscape canvas component supporting dynamic layout swapping (`concentric`, `breadthfirst`, `circle`), node selection callbacks, and path highlighting.
4. `apps/web/src/app/page.jsx`:
   - Full dark ops console layout:
     * Header with live FalkorDB status, Claude 3.5 Sonnet engine badge, and Rule F4 policy indicator.
     * Left rail with one-click trigger buttons for Ring A (Mule Ring), Ring B (Benign Family Cluster), and Ring C (Account Takeover), plus layout toggles.
     * Center viewport hosting the Cytoscape graph canvas, legend pill, and floating node inspector dock.
     * Right rail rendering multi-step agent reasoning traces, confidence score, policy verdicts, and execution action cards.
