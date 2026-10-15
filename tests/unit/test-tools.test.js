/**
 * @file tests/unit/test-tools.test.js
 * @description Unit tests for MCP tool catalog, validation, execution, and security guards.
 */

import { describe, it, expect } from "bun:test";
import {
  TOOL_CATALOG,
  executeTool,
  validateToolParams,
  assertReadOnlyCypher,
} from "../../packages/tools/src/index.js";

describe("MCP Tool Catalog & Registry Tests", () => {
  it("registers all 11 mandatory fraud investigation tools", () => {
    expect(TOOL_CATALOG).toBeDefined();
    const toolNames = TOOL_CATALOG.map(t => t.name);
    
    const requiredTools = [
      "recall_entity",
      "detect_communities",
      "analyze_subgraph",
      "shortest_path",
      "skeptic_challenge",
      "evaluate_freeze_policy",
      "freeze_account",
      "open_case",
      "notify",
      "record_decision",
      "run_cypher_readonly",
    ];

    for (const tool of requiredTools) {
      expect(toolNames).toContain(tool);
    }
  });

  it("ensures every tool has description and valid parameter schema", () => {
    for (const tool of TOOL_CATALOG) {
      expect(typeof tool.name).toBe("string");
      expect(typeof tool.description).toBe("string");
      expect(tool.parameters).toBeDefined();
      expect(tool.parameters.type).toBe("object");
    }
  });

  it("validates parameters against tool schemas", () => {
    // Missing required field 'id' for recall_entity
    const invalidResult = validateToolParams("recall_entity", {});
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);

    // Valid recall_entity call
    const validResult = validateToolParams("recall_entity", { id: "ACC_001", hops: 2 });
    expect(validResult.valid).toBe(true);
  });

  it("executes analyze_subgraph via tool executor", async () => {
    const nodes = [
      { id: "A", label: "Account" },
      { id: "B", label: "Device" },
      { id: "C", label: "Account" },
    ];
    const edges = [
      { source: "A", target: "B", type: "USED" },
      { source: "C", target: "B", type: "USED" },
    ];

    const result = await executeTool("analyze_subgraph", { nodes, edges });
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.order).toBe(3);
    expect(result.data.betweenness["B"]).toBeGreaterThan(0);
  });

  it("executes evaluate_freeze_policy via tool executor", async () => {
    const params = {
      accountId: "ACC_MULE_1",
      flaggedInComponent: 4,
      hopsToBadDevice: 1,
      crossCheckPassed: true,
    };

    const result = await executeTool("evaluate_freeze_policy", params);
    expect(result.success).toBe(true);
    expect(result.data.decision).toBe("FREEZE");
    expect(result.data.confidence).toBeGreaterThan(0.9);
  });

  it("executes skeptic_challenge via tool executor", async () => {
    const params = {
      accountId: "ACC_FAM_1",
      hasSharedAddress: true,
      hasSharedIp: true,
      badDevices: [],
      hasCircularPayments: false,
    };

    const result = await executeTool("skeptic_challenge", params);
    expect(result.success).toBe(true);
    expect(result.data.isBenign).toBe(true);
  });

  it("blocks dangerous mutating queries in assertReadOnlyCypher", () => {
    const dangerousQueries = [
      "MATCH (n) DELETE n",
      "CREATE (a:Account {id: 'bad'})",
      "MATCH (n) SET n.flagged = true",
      "MERGE (a:Account {id: 'hack'})",
      "DROP GRAPH dev_sengra",
    ];

    for (const q of dangerousQueries) {
      expect(() => assertReadOnlyCypher(q)).toThrow();
    }
  });

  it("allows safe read-only queries with reasonable row limit", () => {
    const safeQuery = "MATCH (a:Account)-[r:USED]->(d:Device) RETURN a, r, d LIMIT 100";
    expect(() => assertReadOnlyCypher(safeQuery)).not.toThrow();
    
    // Limits > 1000 should throw
    expect(() => assertReadOnlyCypher("MATCH (n) RETURN n", 5000)).toThrow();
  });
});
