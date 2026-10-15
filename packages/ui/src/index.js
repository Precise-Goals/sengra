/**
 * @file packages/ui/src/index.js
 * @description Main export for @sengra/ui: Cytoscape canvas, CaseCard, TracePanel, MetricsBar, and path animator.
 */

import { CYTOSCAPE_STYLESHEET, ENTITY_COLORS, getNodeColor } from "./styles.js";
import { toCytoscapeElements } from "./converter.js";
import { GraphCanvas } from "./graph-canvas.jsx";
import { CaseCard, getVerdictStyle } from "./case-card.jsx";
import { TracePanel, formatTraceSteps } from "./trace-panel.jsx";
import { MetricsBar } from "./metrics-bar.jsx";
import {
  createPathAnimationSequence,
  generateStepExplanation,
  animateEvidencePath,
} from "./path-animator.js";

export {
  CYTOSCAPE_STYLESHEET,
  ENTITY_COLORS,
  getNodeColor,
  toCytoscapeElements,
  GraphCanvas,
  CaseCard,
  getVerdictStyle,
  TracePanel,
  formatTraceSteps,
  MetricsBar,
  createPathAnimationSequence,
  generateStepExplanation,
  animateEvidencePath,
};

export default {
  CYTOSCAPE_STYLESHEET,
  ENTITY_COLORS,
  getNodeColor,
  toCytoscapeElements,
  GraphCanvas,
  CaseCard,
  getVerdictStyle,
  TracePanel,
  formatTraceSteps,
  MetricsBar,
  createPathAnimationSequence,
  generateStepExplanation,
  animateEvidencePath,
};
