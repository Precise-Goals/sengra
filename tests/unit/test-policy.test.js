import { describe, it, expect } from "bun:test";
import { evaluateFreezePolicy, skepticCheck, DECISION_ACTIONS } from "../../packages/policy/src/index.js";

describe("Deterministic Policy Engine Tests", () => {
  it("approves FREEZE when account in ring with >= 3 flagged accounts and within 2 hops of bad device", () => {
    const verdict = evaluateFreezePolicy({
      accountId: "A-RINGA-1",
      flaggedInComponent: 5,
      hopsToBadDevice: 1,
      previouslyCleared: false,
      crossCheckPassed: true,
      evidencePath: ["A-RINGA-1", "USES", "D-17"],
    });

    expect(verdict.decision).toBe(DECISION_ACTIONS.FREEZE);
    expect(verdict.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("routes to HOLD when flagged ring detected but distance to bad device > 2 hops", () => {
    const verdict = evaluateFreezePolicy({
      accountId: "A-MULE-DISTANT",
      flaggedInComponent: 4,
      hopsToBadDevice: 3,
      previouslyCleared: false,
      crossCheckPassed: true,
    });

    expect(verdict.decision).toBe(DECISION_ACTIONS.HOLD);
  });

  it("routes to HOLD when FalkorDB and Graphology cross-check fails", () => {
    const verdict = evaluateFreezePolicy({
      accountId: "A-DISCREPANCY",
      flaggedInComponent: 4,
      hopsToBadDevice: 1,
      crossCheckPassed: false,
    });

    expect(verdict.decision).toBe(DECISION_ACTIONS.HOLD);
  });

  it("clears benign family cluster via Skeptic check and returns NO_ACTION", () => {
    const verdict = evaluateFreezePolicy({
      accountId: "A-RINGB-1",
      flaggedInComponent: 0,
      hopsToBadDevice: Infinity,
      previouslyCleared: false,
      skepticContext: {
        hasSharedAddress: true,
        hasSharedIp: true,
        badDevices: [],
        hasCircularPayments: false,
      },
    });

    expect(verdict.decision).toBe(DECISION_ACTIONS.NO_ACTION);
    expect(verdict.reasons[0]).toBe("SKEPTIC_CLEARED");
  });

  it("clears account previously cleared in memory without new bad devices", () => {
    const verdict = evaluateFreezePolicy({
      accountId: "A-PAST-CLEARED",
      flaggedInComponent: 1,
      hopsToBadDevice: Infinity,
      previouslyCleared: true,
      skepticContext: {
        previouslyCleared: true,
        badDevices: [],
      },
    });

    expect(verdict.decision).toBe(DECISION_ACTIONS.NO_ACTION);
  });
});
