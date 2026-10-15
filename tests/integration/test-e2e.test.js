/**
 * @file tests/integration/test-e2e.test.js
 * @description End-to-end integration test validating agent loop, memory citations, and security bridge.
 */

import { describe, it, expect } from "bun:test";
import { runInvestigation } from "../../packages/agent/src/index.js";
import {
  saveCase,
  saveDecision,
  findPastInvestigations,
} from "../../packages/memory/src/index.js";
import {
  cveToFraudLinks,
  calculateBlastRadius,
} from "../../packages/tools/src/index.js";
import { runBatchEvaluation } from "../../packages/eval/src/index.js";

describe("End-to-End System Integration Tests", () => {
  it("executes full Ring A investigation catching mule ring via 2-hop bad device link", async () => {
    const result = await runInvestigation({
      accountId: "A-RINGA-1",
      flaggedInComponent: 8,
      hopsToBadDevice: 1,
      badDevices: ["D-17"],
      evidencePath: ["A-RINGA-1", "D-17", "A-RINGA-COLLECTOR"],
      subgraph: {
        nodes: [{ id: "A-RINGA-1" }, { id: "D-17" }],
        edges: [{ source: "A-RINGA-1", target: "D-17" }],
      },
    });

    expect(result.success).toBe(true);
    expect(result.decision).toBe("FREEZE");
    expect(result.actionTaken).toBe("ACCOUNT_FROZEN");
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.evidencePath).toContain("D-17");
  });

  it("executes full Ring B investigation clearing benign family cluster via Skeptic challenge", async () => {
    const result = await runInvestigation({
      accountId: "A-RINGB-1",
      hasSharedAddress: true,
      hasSharedIp: true,
      badDevices: [],
      hasCircularPayments: false,
      subgraph: {
        nodes: [{ id: "A-RINGB-1" }, { id: "ADDR-FAMILY-01" }],
        edges: [{ source: "A-RINGB-1", target: "ADDR-FAMILY-01" }],
      },
    });

    expect(result.success).toBe(true);
    expect(result.decision).toBe("NO_ACTION");
    expect(result.skepticCleared).toBe(true);
    expect(result.actionTaken).toBe("CLEARED");
  });

  it("persists investigation in agent_memory and executes cross-session citation on run 2", async () => {
    // Run 1: Store clearance
    await saveCase({
      caseId: "CASE-INTEG-001",
      targetEntity: "A-RINGB-1",
      verdict: "NO_ACTION",
      confidence: 0.95,
      summary: "Benign family cluster clearance in integration test.",
      evidenceNodes: ["A-RINGB-1", "ADDR-FAMILY-01"],
    });

    await saveDecision({
      id: "DEC-INTEG-001",
      caseId: "CASE-INTEG-001",
      target: "A-RINGB-1",
      decision: "NO_ACTION",
      confidence: 0.95,
      cleared: true,
      explanation: "Benign family cluster clearance in integration test.",
      evidencePath: ["A-RINGB-1", "ADDR-FAMILY-01"],
    });

    // Run 2: Recall past clearance
    const pastCases = await findPastInvestigations("A-RINGB-1");
    expect(pastCases.length).toBeGreaterThan(0);
    expect(pastCases[0].decision).toBe("NO_ACTION");

    // Second investigation cites prior clearance
    const run2Result = await runInvestigation({
      accountId: "A-RINGB-1",
      previouslyCleared: true,
      badDevices: [],
      hasSharedAddress: true,
      hasSharedIp: true,
    });

    expect(run2Result.decision).toBe("NO_ACTION");
    expect(run2Result.skepticCleared).toBe(true);
  });

  it("traverses cross-domain cybersecurity bridge from CVE to compromised accounts", () => {
    const bridge = cveToFraudLinks({ cveId: "CVE-2024-3094" });

    expect(bridge.success).toBe(true);
    expect(bridge.cveId).toBe("CVE-2024-3094");
    expect(bridge.compromisedService).toBe("SVC-AUTH-PORTAL");
    expect(bridge.compromisedAccounts).toContain("A-TAKEOVER-1");

    const blast = calculateBlastRadius({ serviceId: "SVC-AUTH-PORTAL" });
    expect(blast.downstreamServices).toContain("SVC-PAYMENT-CORE");
    expect(blast.affectedDatastores).toContain("DB-USER-CREDENTIALS");
  });

  it("executes batch evaluation benchmark confirming graph agent superiority", async () => {
    const evaluation = await runBatchEvaluation();

    expect(evaluation.graphMetrics.precision).toBeGreaterThanOrEqual(0.9);
    expect(evaluation.graphMetrics.recall).toBeGreaterThanOrEqual(0.9);
    expect(evaluation.delta.precisionImprovement).toBeGreaterThan(0.25);
    expect(evaluation.delta.recallImprovement).toBeGreaterThan(0.25);
  });
});
