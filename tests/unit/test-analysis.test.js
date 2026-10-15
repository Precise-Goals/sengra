import { describe, it, expect } from "bun:test";
import { analyzeSubgraph, crossCheckComponents } from "../../packages/analysis/src/index.js";

describe("Graphology Analysis Engine Tests", () => {
  it("identifies bridge node with highest betweenness centrality", () => {
    // Linear bridge: A -- Bridge -- B
    const nodes = [
      { id: "NODE-A", label: "Account" },
      { id: "NODE-BRIDGE", label: "Device" },
      { id: "NODE-B", label: "Account" },
    ];
    const edges = [
      { source: "NODE-A", target: "NODE-BRIDGE", type: "USES" },
      { source: "NODE-BRIDGE", target: "NODE-B", type: "USES" },
    ];

    const result = analyzeSubgraph(nodes, edges);
    expect(result.order).toBe(3);
    expect(result.size).toBe(2);
    expect(result.bridgeNodes.length).toBeGreaterThan(0);
    expect(result.bridgeNodes[0].nodeId).toBe("NODE-BRIDGE");
    expect(result.bridgeNodes[0].score).toBeGreaterThan(0);
  });

  it("detects disconnected components", () => {
    const nodes = [
      { id: "A-1", label: "Account" },
      { id: "A-2", label: "Account" },
      { id: "B-1", label: "Account" },
      { id: "B-2", label: "Account" },
    ];
    const edges = [
      { source: "A-1", target: "A-2", type: "PAID_TO" },
      { source: "B-1", target: "B-2", type: "PAID_TO" },
    ];

    const result = analyzeSubgraph(nodes, edges);
    expect(result.componentCount).toBe(2);
  });

  it("partitions communities with Louvain", () => {
    // 2 dense triangles connected by 1 edge
    const nodes = [
      { id: "1" }, { id: "2" }, { id: "3" },
      { id: "4" }, { id: "5" }, { id: "6" },
    ];
    const edges = [
      { source: "1", target: "2" }, { source: "2", target: "3" }, { source: "3", target: "1" },
      { source: "4", target: "5" }, { source: "5", target: "6" }, { source: "6", target: "4" },
      { source: "3", target: "4" },
    ];

    const result = analyzeSubgraph(nodes, edges);
    expect(result.communities["1"]).toBe(result.communities["2"]);
    expect(result.communities["4"]).toBe(result.communities["5"]);
  });

  it("cross-checks FalkorDB and Graphology components correctly", () => {
    const match = crossCheckComponents(2, 2);
    expect(match.matches).toBe(true);
    expect(match.recommendation).toBe("PROCEED");

    const mismatch = crossCheckComponents(2, 3);
    expect(mismatch.matches).toBe(false);
    expect(mismatch.recommendation).toBe("HOLD");
  });
});
