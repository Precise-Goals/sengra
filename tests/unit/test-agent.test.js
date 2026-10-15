/**
 * @file tests/unit/test-agent.test.js
 * @description Unit tests for SENGRA fraud investigation agent loop and tool calling.
 */

import { describe, it, expect } from "bun:test";
import {
  SYSTEM_PROMPT,
  createAgentTools,
  runInvestigation,
} from "../../packages/agent/src/index.js";

describe("Agent Loop & Orchestration Tests", () => {
  it("exports a comprehensive system prompt enforcing Rule F4 and Skeptic challenges", () => {
    expect(SYSTEM_PROMPT).toBeDefined();
    expect(typeof SYSTEM_PROMPT).toBe("string");
    expect(SYSTEM_PROMPT).toContain("Fraud Investigator");
    expect(SYSTEM_PROMPT).toContain("Rule F4");
    expect(SYSTEM_PROMPT).toContain("Skeptic");
    expect(SYSTEM_PROMPT).toContain("FREEZE");
  });

  it("creates AI SDK compliant tool definitions", () => {
    const tools = createAgentTools();
    expect(tools).toBeDefined();
    expect(tools.recall_entity).toBeDefined();
    expect(tools.analyze_subgraph).toBeDefined();
    expect(tools.skeptic_challenge).toBeDefined();
    expect(tools.evaluate_freeze_policy).toBeDefined();
    expect(tools.freeze_account).toBeDefined();
    expect(typeof tools.recall_entity.description).toBe("string");
  });

  it("investigates Ring A suspect account and arrives at FREEZE decision", async () => {
    // Ring A: suspect account connected to bad device and mule cluster
    const context = {
      accountId: "A-RINGA-1",
      flaggedInComponent: 5,
      hopsToBadDevice: 1,
      badDevices: ["D-17"],
      hasSharedAddress: false,
      hasSharedIp: false,
      crossCheckPassed: true,
      subgraph: {
        nodes: [
          { id: "A-RINGA-1", label: "Account" },
          { id: "D-17", label: "Device", known_bad: true },
          { id: "A-RINGA-2", label: "Account" },
        ],
        edges: [
          { source: "A-RINGA-1", target: "D-17", type: "USED" },
          { source: "A-RINGA-2", target: "D-17", type: "USED" },
        ],
      },
    };

    const result = await runInvestigation(context);
    expect(result.success).toBe(true);
    expect(result.decision).toBe("FREEZE");
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.trace).toBeDefined();
    expect(result.trace.length).toBeGreaterThan(0);
    expect(result.actionTaken).toBe("ACCOUNT_FROZEN");
  });

  it("investigates Ring B benign family account and clears via Skeptic challenge", async () => {
    // Ring B: family cluster sharing address and IP, zero bad devices
    const context = {
      accountId: "A-RINGB-1",
      flaggedInComponent: 1,
      hopsToBadDevice: Infinity,
      badDevices: [],
      hasSharedAddress: true,
      hasSharedIp: true,
      hasCircularPayments: false,
      crossCheckPassed: true,
      subgraph: {
        nodes: [
          { id: "A-RINGB-1", label: "Account" },
          { id: "ADDR-B-HOME", label: "Address" },
          { id: "A-RINGB-2", label: "Account" },
        ],
        edges: [
          { source: "A-RINGB-1", target: "ADDR-B-HOME", type: "HAS_ADDRESS" },
          { source: "A-RINGB-2", target: "ADDR-B-HOME", type: "HAS_ADDRESS" },
        ],
      },
    };

    const result = await runInvestigation(context);
    expect(result.success).toBe(true);
    expect(result.decision).toBe("NO_ACTION");
    expect(result.skepticCleared).toBe(true);
    expect(result.actionTaken).toBe("CLEARED");
  });
});
