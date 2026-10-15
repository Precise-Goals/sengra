/**
 * @file packages/ui/src/index.js
 * @description Main export for @sengra/ui: Cytoscape stylesheet, converters, and graph canvas.
 */

import { CYTOSCAPE_STYLESHEET, ENTITY_COLORS, getNodeColor } from "./styles.js";
import { toCytoscapeElements } from "./converter.js";
import { GraphCanvas } from "./graph-canvas.jsx";

export {
  CYTOSCAPE_STYLESHEET,
  ENTITY_COLORS,
  getNodeColor,
  toCytoscapeElements,
  GraphCanvas,
};

export default {
  CYTOSCAPE_STYLESHEET,
  ENTITY_COLORS,
  getNodeColor,
  toCytoscapeElements,
  GraphCanvas,
};
