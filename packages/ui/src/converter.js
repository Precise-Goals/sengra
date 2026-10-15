/**
 * @file packages/ui/src/converter.js
 * @description Translates raw graph nodes and edges into Cytoscape element definitions.
 */

/**
 * Converts generic node and edge arrays into Cytoscape.js elements.
 * @param {Array<object>} nodes
 * @param {Array<object>} edges
 * @returns {Array<object>} Cytoscape elements
 */
export function toCytoscapeElements(nodes = [], edges = []) {
  const elements = [];

  for (const n of nodes) {
    if (!n || !n.id) continue;
    const isBad = Boolean(n.known_bad || n.properties?.known_bad);
    const label = n.label || "Account";
    const name = n.name || n.properties?.name || n.id;

    const classes = [];
    if (label) classes.push(`node-${label.toLowerCase()}`);
    if (isBad) classes.push("bad-device");

    elements.push({
      group: "nodes",
      data: {
        id: n.id,
        label,
        name,
        known_bad: isBad,
        ...n.properties,
        ...n,
      },
      classes: classes.join(" "),
    });
  }

  for (const e of edges) {
    if (!e || !e.source || !e.target) continue;
    const id = e.id || `${e.source}->${e.target}`;
    elements.push({
      group: "edges",
      data: {
        id,
        source: e.source,
        target: e.target,
        type: e.type || "CONNECTED",
        ...e.properties,
        ...e,
      },
      classes: e.highlighted ? "highlighted-edge" : "",
    });
  }

  return elements;
}

export default {
  toCytoscapeElements,
};
