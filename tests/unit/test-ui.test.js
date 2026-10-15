/**
 * @file tests/unit/test-ui.test.js
 * @description Unit tests for Cytoscape styles, graph elements conversion, and visual encoding.
 */

import { describe, it, expect } from "bun:test";
import {
  CYTOSCAPE_STYLESHEET,
  toCytoscapeElements,
  getNodeColor,
} from "../../packages/ui/src/index.js";

describe("UI & Cytoscape Graph Visualization Tests", () => {
  it("exports a valid Cytoscape stylesheet array with dark mode theme", () => {
    expect(Array.isArray(CYTOSCAPE_STYLESHEET)).toBe(true);
    expect(CYTOSCAPE_STYLESHEET.length).toBeGreaterThan(5);

    const selectors = CYTOSCAPE_STYLESHEET.map(s => s.selector);
    expect(selectors).toContain("node");
    expect(selectors).toContain("edge");
    expect(selectors).toContain(".highlighted");
  });

  it("assigns appropriate color codes per entity type and threat status", () => {
    expect(getNodeColor("Device", true)).toBe("#ef4444"); // Known bad device
    expect(getNodeColor("Account", false)).toBe("#38bdf8"); // Account (sky-400)
    expect(getNodeColor("Device", false)).toBe("#a855f7"); // Device (purple-500)
    expect(getNodeColor("Address", false)).toBe("#f59e0b"); // Address (amber-500)
    expect(getNodeColor("Card", false)).toBe("#10b981"); // Card (emerald-500)
  });

  it("converts raw graph nodes and edges into Cytoscape data elements", () => {
    const nodes = [
      { id: "ACC_1", label: "Account", name: "Alice" },
      { id: "DEV_BAD", label: "Device", known_bad: true },
    ];
    const edges = [
      { id: "e1", source: "ACC_1", target: "DEV_BAD", type: "USED" },
    ];

    const elements = toCytoscapeElements(nodes, edges);
    expect(elements.length).toBe(3);

    const accountNode = elements.find(el => el.data.id === "ACC_1");
    expect(accountNode.data.label).toBe("Account");
    expect(accountNode.classes).toContain("node-account");

    const badDeviceNode = elements.find(el => el.data.id === "DEV_BAD");
    expect(badDeviceNode.data.known_bad).toBe(true);
    expect(badDeviceNode.classes).toContain("bad-device");

    const edgeEl = elements.find(el => el.data.source === "ACC_1");
    expect(edgeEl.data.target).toBe("DEV_BAD");
    expect(edgeEl.data.type).toBe("USED");
  });
});
