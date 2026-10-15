/**
 * @file packages/ui/src/styles.js
 * @description High-contrast dark mode Cytoscape stylesheet and color utilities.
 */

export const ENTITY_COLORS = {
  Account: "#38bdf8",     // sky-400
  Device: "#a855f7",      // purple-500
  BadDevice: "#ef4444",   // red-500
  Address: "#f59e0b",     // amber-500
  Card: "#10b981",        // emerald-500
  IPAddress: "#06b6d4",   // cyan-500
  Default: "#94a3b8",     // slate-400
};

/**
 * Returns color code for entity type, prioritizing threat status.
 * @param {string} label
 * @param {boolean} [isBad]
 */
export function getNodeColor(label, isBad = false) {
  if (isBad || label === "BadDevice") {
    return ENTITY_COLORS.BadDevice;
  }
  return ENTITY_COLORS[label] || ENTITY_COLORS.Default;
}

export const CYTOSCAPE_STYLESHEET = [
  {
    selector: "node",
    style: {
      "background-color": "#38bdf8",
      label: "data(name)",
      color: "#f8fafc",
      "font-size": "11px",
      "font-family": "Inter, system-ui, sans-serif",
      "font-weight": 600,
      "text-valign": "bottom",
      "text-margin-y": 6,
      width: 32,
      height: 32,
      "border-width": 2,
      "border-color": "#0284c7",
      "transition-property": "background-color, border-color, border-width, width, height",
      "transition-duration": "0.3s",
    },
  },
  {
    selector: "node[label = 'Account'], .node-account",
    style: {
      "background-color": "#38bdf8",
      "border-color": "#0284c7",
      shape: "ellipse",
    },
  },
  {
    selector: "node[label = 'Device'], .node-device",
    style: {
      "background-color": "#a855f7",
      "border-color": "#7e22ce",
      shape: "round-rectangle",
    },
  },
  {
    selector: ".bad-device, node[?known_bad]",
    style: {
      "background-color": "#ef4444",
      "border-color": "#b91c1c",
      "border-width": 3,
      width: 40,
      height: 40,
    },
  },
  {
    selector: "node[label = 'Address'], .node-address",
    style: {
      "background-color": "#f59e0b",
      "border-color": "#d97706",
      shape: "hexagon",
    },
  },
  {
    selector: "node[label = 'Card'], .node-card",
    style: {
      "background-color": "#10b981",
      "border-color": "#047857",
      shape: "diamond",
    },
  },
  {
    selector: "edge",
    style: {
      width: 1.5,
      "line-color": "#52525b",
      "target-arrow-color": "#52525b",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      label: "data(type)",
      "font-size": "9px",
      color: "#a1a1aa",
      "text-rotation": "autorotate",
      "text-background-opacity": 0.8,
      "text-background-color": "#09090b",
      "text-background-padding": 2,
    },
  },
  {
    selector: ".highlighted",
    style: {
      "border-color": "#fbbf24",
      "border-width": 4,
      "shadow-blur": 15,
      "shadow-color": "#fbbf24",
      "shadow-opacity": 0.8,
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-color": "#38bdf8",
      "border-width": 4,
    },
  },
  {
    selector: "edge.highlighted-edge",
    style: {
      width: 3.5,
      "line-color": "#ef4444",
      "target-arrow-color": "#ef4444",
      "shadow-blur": 10,
      "shadow-color": "#ef4444",
      "shadow-opacity": 0.7,
    },
  },
];

export default {
  ENTITY_COLORS,
  getNodeColor,
  CYTOSCAPE_STYLESHEET,
};
