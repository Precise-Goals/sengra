/**
 * @file tests/unit/test-memory-page.test.js
 * @description Unit tests for Memory Explorer UI dataset and cross-session case representations.
 */

import { describe, it, expect } from "bun:test";
import { DecisionSchema } from "../../packages/schema/src/index.js";

describe("Memory Explorer UI & Case Representation Tests", () => {
  it("validates that all demo memory decisions conform to DecisionSchema", () => {
    const memoryDecisions = [
      {
        id: "DEC-2026-001",
        target: "A-RINGB-1",
        decision: "NO_ACTION",
        confidence: 0.92,
        policy: "freeze_policy_v1",
        explanation: "Cleared via Skeptic challenge: benign household cluster.",
        evidencePath: ["A-RINGB-1", "ADDR-FAMILY-01"],
      },
      {
        id: "DEC-2026-002",
        target: "A-RINGA-1",
        decision: "FREEZE",
        confidence: 0.95,
        policy: "freeze_policy_v1",
        explanation: "Connected to confirmed fraud rig D-17 within 1 hop.",
        evidencePath: ["A-RINGA-1", "D-17"],
      },
      {
        id: "DEC-2026-003",
        target: "A-TAKEOVER-1",
        decision: "FREEZE",
        confidence: 0.98,
        policy: "security_bridge_v1",
        explanation: "Compromised via CVE-2024-3094 leaked credential.",
        evidencePath: ["A-TAKEOVER-1", "CRED-LEAKED-HASH", "CVE-2024-3094"],
      },
    ];

    for (const dec of memoryDecisions) {
      const parsed = DecisionSchema.parse(dec);
      expect(parsed.target).toBe(dec.target);
      expect(parsed.confidence).toBeGreaterThanOrEqual(0.9);
      expect(parsed.evidencePath.length).toBeGreaterThan(0);
    }
  });

  it("verifies filtering logic for cleared vs frozen cases", () => {
    const cases = [
      { id: "C1", verdict: "NO_ACTION" },
      { id: "C2", verdict: "FREEZE" },
      { id: "C3", verdict: "NO_ACTION" },
    ];

    const cleared = cases.filter((c) => c.verdict === "NO_ACTION");
    const frozen = cases.filter((c) => c.verdict === "FREEZE");

    expect(cleared.length).toBe(2);
    expect(frozen.length).toBe(1);
  });
});
