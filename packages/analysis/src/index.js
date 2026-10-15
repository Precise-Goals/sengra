/**
 * @file packages/analysis/src/index.js
 * @description In-process Graphology graph analytics engine for community detection, betweenness centrality, and WCC cross-checking.
 */

import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import betweenness from "graphology-metrics/centrality/betweenness.js";
import { connectedComponents } from "graphology-components";

/**
 * Builds an in-process Graphology undirected graph from nodes and edges and computes topological metrics.
 * @param {Array<{id: string, [key: string]: any}>} nodes
 * @param {Array<{source: string, target: string, [key: string]: any}>} edges
 * @returns {object} Computed metrics: communities, betweenness, components, density, bridgeNodes
 */
export function analyzeSubgraph(nodes = [], edges = []) {
  const g = new Graph({ type: "undirected", multi: false });

  // Add nodes safely
  for (const n of nodes) {
    if (n && n.id && !g.hasNode(n.id)) {
      g.addNode(n.id, n);
    }
  }

  // Add edges safely
  for (const e of edges) {
    if (e && e.source && e.target) {
      if (g.hasNode(e.source) && g.hasNode(e.target)) {
        if (!g.hasEdge(e.source, e.target)) {
          g.addEdge(e.source, e.target, e);
        }
      }
    }
  }

  const order = g.order;
  const size = g.size;
  const density = order > 1 ? (2 * size) / (order * (order - 1)) : 0;

  // Run Louvain community detection
  let communities = {};
  try {
    communities = order > 0 ? louvain(g) : {};
  } catch (err) {
    // Isolated nodes fallback
    nodes.forEach((n, idx) => { communities[n.id] = idx; });
  }

  // Run betweenness centrality
  let betweennessScores = {};
  try {
    betweennessScores = order > 0 ? betweenness(g) : {};
  } catch (err) {
    nodes.forEach(n => { betweennessScores[n.id] = 0; });
  }

  // Run connected components
  const components = order > 0 ? connectedComponents(g) : [];

  // Rank bridge nodes (high betweenness centrality)
  const bridgeNodes = Object.entries(betweennessScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0)
    .map(([nodeId, score]) => ({ nodeId, score }));

  return {
    order,
    size,
    density,
    communities,
    betweenness: betweennessScores,
    components,
    componentCount: components.length,
    bridgeNodes,
  };
}

/**
 * Cross-checks FalkorDB in-database WCC component count against Graphology in-process components.
 * Explainability and safeguard feature: discrepancies lower confidence and route to HOLD.
 * @param {number} falkorWccCount
 * @param {number} graphologyComponentCount
 */
export function crossCheckComponents(falkorWccCount, graphologyComponentCount) {
  const matches = falkorWccCount === graphologyComponentCount;
  return {
    matches,
    falkorWccCount,
    graphologyComponentCount,
    confidenceModifier: matches ? 1.0 : 0.75,
    recommendation: matches ? "PROCEED" : "HOLD",
    explanation: matches
      ? "FalkorDB in-database WCC and in-process Graphology connected components match identically."
      : `Discrepancy detected between FalkorDB WCC (${falkorWccCount}) and Graphology (${graphologyComponentCount}); confidence lowered.`,
  };
}

export default {
  analyzeSubgraph,
  crossCheckComponents,
};
