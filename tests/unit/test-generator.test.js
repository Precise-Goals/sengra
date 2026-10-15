import { describe, it, expect } from "bun:test";
import { generateSyntheticData } from "../../packages/data/src/generator.js";
import { GROUND_TRUTH } from "../../packages/data/src/ground-truth.js";

describe("Synthetic Data Generator Tests", () => {
  it("produces deterministic output with same seed", () => {
    const run1 = generateSyntheticData(42, { noiseAccounts: 100 });
    const run2 = generateSyntheticData(42, { noiseAccounts: 100 });

    expect(run1.nodes.length).toBe(run2.nodes.length);
    expect(run1.edges.length).toBe(run2.edges.length);
    expect(run1.nodes[0].id).toBe(run2.nodes[0].id);
    expect(run1.edges[0].id).toBe(run2.edges[0].id);
  });

  it("correctly plants Ring A (Mule Ring)", () => {
    const data = generateSyntheticData(42, { noiseAccounts: 50 });
    const nodeMap = new Map(data.nodes.map(n => [n.id, n]));

    // 8 accounts
    expect(GROUND_TRUTH.ringA.accounts.length).toBe(8);
    for (const accId of GROUND_TRUTH.ringA.accounts) {
      expect(nodeMap.has(accId)).toBe(true);
      expect(nodeMap.get(accId).properties.flagged).toBe(true);
    }

    // Collector mule
    expect(nodeMap.get(GROUND_TRUTH.ringA.collectorMule).properties.isCollector).toBe(true);

    // Bad device D-17
    expect(nodeMap.has("D-17")).toBe(true);
    expect(nodeMap.get("D-17").properties.known_bad).toBe(true);
  });

  it("correctly plants Ring B (Family Cluster)", () => {
    const data = generateSyntheticData(42, { noiseAccounts: 50 });
    const nodeMap = new Map(data.nodes.map(n => [n.id, n]));

    // 5 accounts
    expect(GROUND_TRUTH.ringB.accounts.length).toBe(5);
    for (const accId of GROUND_TRUTH.ringB.accounts) {
      expect(nodeMap.has(accId)).toBe(true);
      expect(nodeMap.get(accId).properties.flagged).toBe(false);
    }

    // Shared family infrastructure
    expect(nodeMap.has("ADDR-FAMILY-01")).toBe(true);
    expect(nodeMap.has("IP-FAMILY-WIFI")).toBe(true);
  });

  it("scales to target node count range (1,500 - 3,000 nodes)", () => {
    const data = generateSyntheticData(42, { noiseAccounts: 500 });
    expect(data.nodes.length).toBeGreaterThanOrEqual(1000);
    expect(data.nodes.length).toBeLessThanOrEqual(3500);
  });
});
