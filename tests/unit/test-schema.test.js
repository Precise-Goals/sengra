import { describe, it, expect } from "bun:test";
import {
  AccountSchema,
  DeviceSchema,
  IPAddressSchema,
  TransactionSchema,
  DecisionSchema,
  SubgraphSchema,
  RecallEntityInputSchema,
} from "../../packages/schema/src/index.js";

describe("Schema Validation Tests", () => {
  it("validates valid Account schema", () => {
    const valid = AccountSchema.parse({
      id: "A-001",
      flagged: true,
      frozen: false,
    });
    expect(valid.id).toBe("A-001");
    expect(valid.flagged).toBe(true);
    expect(valid.frozen).toBe(false);
  });

  it("validates Device schema with known_bad", () => {
    const dev = DeviceSchema.parse({
      id: "D-100",
      known_bad: true,
      fingerprint: "fp-abc-123",
    });
    expect(dev.known_bad).toBe(true);
  });

  it("rejects invalid Transaction with negative amount", () => {
    expect(() => {
      TransactionSchema.parse({
        id: "T-01",
        amount: -50,
        ts: Date.now(),
      });
    }).toThrow();
  });

  it("validates Decision schema format", () => {
    const decision = DecisionSchema.parse({
      decision: "FREEZE",
      target: "A-482",
      confidence: 0.95,
      explanation: "Suspect shares known bad device D-17 with flagged ring members.",
      evidencePath: ["A-482", "USES", "D-17"],
    });
    expect(decision.decision).toBe("FREEZE");
    expect(decision.confidence).toBe(0.95);
  });

  it("validates Subgraph schema structure", () => {
    const sub = SubgraphSchema.parse({
      nodes: [
        { id: "A-1", label: "Account", properties: { flagged: true } },
        { id: "D-1", label: "Device", properties: { known_bad: true } },
      ],
      edges: [
        { source: "A-1", target: "D-1", type: "USES", properties: {} },
      ],
    });
    expect(sub.nodes.length).toBe(2);
    expect(sub.edges.length).toBe(1);
  });

  it("validates RecallEntity input parameters", () => {
    const input = RecallEntityInputSchema.parse({
      type: "Account",
      id: "A-123",
    });
    expect(input.type).toBe("Account");
  });
});
