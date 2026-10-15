/**
 * @file tests/unit/test-case-card.test.js
 * @description Unit tests for CaseCard, TracePanel, MetricsBar, and UI presentation helpers.
 */

import { describe, it, expect } from "bun:test";
import {
  CaseCard,
  TracePanel,
  MetricsBar,
  getVerdictStyle,
  formatTraceSteps,
} from "../../packages/ui/src/index.js";

describe("Case Card & Trace Panel UI Tests", () => {
  it("exports CaseCard, TracePanel, and MetricsBar components", () => {
    expect(typeof CaseCard).toBe("function");
    expect(typeof TracePanel).toBe("function");
    expect(typeof MetricsBar).toBe("function");
  });

  it("returns proper styling maps for all three policy verdicts", () => {
    const freezeStyle = getVerdictStyle("FREEZE");
    expect(freezeStyle.badge).toContain("red");
    expect(freezeStyle.border).toContain("red");

    const clearStyle = getVerdictStyle("NO_ACTION");
    expect(clearStyle.badge).toContain("emerald");

    const holdStyle = getVerdictStyle("HOLD");
    expect(holdStyle.badge).toContain("amber");
  });

  it("formats multi-step trace into clean inspector items", () => {
    const rawTrace = [
      {
        tool: "recall_entity",
        timestamp: "2026-10-16T04:00:00Z",
        inputs: { id: "A-RINGA-1", hops: 2 },
        output: { entityId: "A-RINGA-1", count: 4 },
      },
      {
        tool: "evaluate_freeze_policy",
        timestamp: "2026-10-16T04:00:01Z",
        inputs: { accountId: "A-RINGA-1" },
        output: { decision: "FREEZE" },
      },
    ];

    const formatted = formatTraceSteps(rawTrace);
    expect(formatted.length).toBe(2);
    expect(formatted[0].stepNumber).toBe(1);
    expect(formatted[0].toolName).toBe("recall_entity");
    expect(formatted[1].stepNumber).toBe(2);
    expect(formatted[1].toolName).toBe("evaluate_freeze_policy");
  });
});
