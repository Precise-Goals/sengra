/**
 * @file tests/unit/test-baseline.test.js
 * @description Unit tests for flat-table baseline fraud evaluator and comparative failure modes.
 */

import { describe, it, expect } from "bun:test";
import {
  evaluateBaseline,
  compareAgentVsBaseline,
} from "../../packages/eval/src/index.js";

describe("Flat-Table Baseline Fraud Agent Tests", () => {
  it("freezes accounts directly connected to known-bad devices", () => {
    const row = {
      accountId: "ACC_DIRECT_BAD",
      directDeviceId: "D-17",
      directDeviceKnownBad: true,
      sharedIpCount: 1,
      sharedAddressCount: 1,
    };

    const result = evaluateBaseline(row);
    expect(result.decision).toBe("FREEZE");
    expect(result.reason).toContain("Direct bad device");
  });

  it("reproduces False Positive failure mode on Ring B (benign family cluster)", () => {
    // Ring B: Legitimate family members sharing residential IP and address
    const familyMemberRow = {
      accountId: "A-RINGB-1",
      directDeviceId: "DEV_CLEAN_1",
      directDeviceKnownBad: false,
      sharedIpCount: 5,        // Naive rule triggers here!
      sharedAddressCount: 5,   // Naive rule triggers here!
    };

    const result = evaluateBaseline(familyMemberRow);
    // Baseline naively flags shared IP without Skeptic challenge
    expect(result.decision).toBe("FREEZE");
    expect(result.isFalsePositive).toBe(true);
  });

  it("reproduces False Negative failure mode on Ring A (collector mule 2 hops away)", () => {
    // Ring A Collector Mule: connected to other mules, 2 hops away from D-17
    const collectorMuleRow = {
      accountId: "A-RINGA-COLLECTOR",
      directDeviceId: "D-18",       // D-18 is not directly flagged
      directDeviceKnownBad: false,
      sharedIpCount: 1,
      sharedAddressCount: 1,
    };

    const result = evaluateBaseline(collectorMuleRow);
    // Baseline misses multi-hop syndicate because direct device is not bad
    expect(result.decision).toBe("NO_ACTION");
    expect(result.isFalseNegative).toBe(true);
  });

  it("proves Graph Agent superiority over Baseline in side-by-side comparison", async () => {
    // Family Cluster comparison
    const familyComparison = await compareAgentVsBaseline({
      accountId: "A-RINGB-1",
      scenario: "Ring B: Family Cluster",
      hasSharedAddress: true,
      hasSharedIp: true,
      badDevices: [],
      subgraph: {
        nodes: [{ id: "A-RINGB-1" }, { id: "ADDR-B-HOME" }],
        edges: [{ source: "A-RINGB-1", target: "ADDR-B-HOME" }],
      },
      baselineRow: {
        accountId: "A-RINGB-1",
        directDeviceKnownBad: false,
        sharedIpCount: 5,
        sharedAddressCount: 5,
      },
    });

    expect(familyComparison.graphAgent.decision).toBe("NO_ACTION"); // Correct clearance!
    expect(familyComparison.baselineAgent.decision).toBe("FREEZE");  // False positive!
    expect(familyComparison.winner).toBe("GRAPH_AGENT");
  });
});
