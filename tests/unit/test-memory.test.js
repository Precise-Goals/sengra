/**
 * @file tests/unit/test-memory.test.js
 * @description Unit tests for cross-session memory, case tracking, and decision audit trails.
 */

import { describe, it, expect } from "bun:test";
import {
  saveCase,
  getCase,
  saveDecision,
  getDecisionsForEntity,
  findPastInvestigations,
  clearMemoryStore,
} from "../../packages/memory/src/index.js";

describe("Cross-Session Memory & Audit Persistence Tests", () => {
  it("persists and retrieves an investigation case", async () => {
    const caseData = {
      caseId: "CASE_2026_001",
      title: "Mule Ring Alpha Investigation",
      target: "ACC_MULE_1",
      severity: "CRITICAL",
    };

    const saved = await saveCase(caseData);
    expect(saved.caseId).toBe("CASE_2026_001");
    expect(saved.createdAt).toBeDefined();

    const retrieved = await getCase("CASE_2026_001");
    expect(retrieved).toBeDefined();
    expect(retrieved.title).toBe("Mule Ring Alpha Investigation");
    expect(retrieved.target).toBe("ACC_MULE_1");
  });

  it("persists structured decision with evidence path", async () => {
    const decisionData = {
      id: "DEC_MULE_001",
      target: "ACC_MULE_1",
      decision: "FREEZE",
      confidence: 0.95,
      policy: "freeze_policy_v1",
      explanation: "Connected to known-bad device D-17 within 1 hop.",
      evidencePath: ["ACC_MULE_1", "USED", "D-17"],
    };

    const saved = await saveDecision(decisionData);
    expect(saved.id).toBe("DEC_MULE_001");

    const entityDecisions = await getDecisionsForEntity("ACC_MULE_1");
    expect(entityDecisions.length).toBeGreaterThan(0);
    expect(entityDecisions[0].decision).toBe("FREEZE");
    expect(entityDecisions[0].evidencePath).toContain("D-17");
  });

  it("recalls past investigations for cross-session citation", async () => {
    // Session 1: Clears family account
    await saveCase({
      caseId: "CASE_FAM_001",
      title: "Family Cluster Review",
      target: "ACC_FAM_100",
      severity: "LOW",
    });

    await saveDecision({
      id: "DEC_FAM_001",
      caseId: "CASE_FAM_001",
      target: "ACC_FAM_100",
      decision: "NO_ACTION",
      confidence: 0.92,
      policy: "freeze_policy_v1",
      explanation: "Cleared via Skeptic challenge: shared home Wi-Fi and address with zero bad devices.",
      evidencePath: ["ACC_FAM_100", "ADDR_HOME"],
      cleared: true,
    });

    // Session 2: Recalls Session 1 finding
    const pastInvestigations = await findPastInvestigations("ACC_FAM_100");
    expect(pastInvestigations.length).toBeGreaterThan(0);

    const priorCase = pastInvestigations[0];
    expect(priorCase.target).toBe("ACC_FAM_100");
    expect(priorCase.decision).toBe("NO_ACTION");
    expect(priorCase.cleared).toBe(true);
    expect(priorCase.explanation).toContain("Skeptic");
  });
});
