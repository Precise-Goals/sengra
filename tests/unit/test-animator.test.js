/**
 * @file tests/unit/test-animator.test.js
 * @description Unit tests for animated graph evidence path sequencer and explanation generator.
 */

import { describe, it, expect } from "bun:test";
import {
  createPathAnimationSequence,
  generateStepExplanation,
} from "../../packages/ui/src/index.js";

describe("Graph Evidence Path Animator Tests", () => {
  it("converts node path array into sequential animation steps", () => {
    const path = ["A-RINGA-1", "D-17", "A-RINGA-COLLECTOR"];
    const sequence = createPathAnimationSequence(path);

    expect(sequence.length).toBe(3);
    expect(sequence[0].nodeId).toBe("A-RINGA-1");
    expect(sequence[0].targetNodeId).toBe("D-17");
    expect(sequence[0].isFinal).toBe(false);

    expect(sequence[1].nodeId).toBe("D-17");
    expect(sequence[1].targetNodeId).toBe("A-RINGA-COLLECTOR");

    expect(sequence[2].nodeId).toBe("A-RINGA-COLLECTOR");
    expect(sequence[2].targetNodeId).toBeNull();
    expect(sequence[2].isFinal).toBe(true);
  });

  it("handles empty or single-node paths safely", () => {
    expect(createPathAnimationSequence([])).toEqual([]);

    const single = createPathAnimationSequence(["SINGLE_ACC"]);
    expect(single.length).toBe(1);
    expect(single[0].nodeId).toBe("SINGLE_ACC");
    expect(single[0].isFinal).toBe(true);
  });

  it("generates contextual step explanation subtitles", () => {
    const alertExp = generateStepExplanation("A-RINGA-1", "Account", false, 0, 3);
    expect(alertExp).toContain("Step 1 of 3");
    expect(alertExp).toContain("A-RINGA-1");

    const badDevExp = generateStepExplanation("D-17", "Device", true, 1, 3);
    expect(badDevExp).toContain("Step 2 of 3");
    expect(badDevExp).toContain("D-17");
    expect(badDevExp.toLowerCase()).toContain("fraud");
  });
});
