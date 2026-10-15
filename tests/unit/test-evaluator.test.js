/**
 * @file tests/unit/test-evaluator.test.js
 * @description Unit tests for SENGRA evaluation benchmark suite and quantitative metrics.
 */

import { describe, it, expect } from "bun:test";
import {
  calculateConfusionMatrix,
  calculateMetrics,
  runBatchEvaluation,
} from "../../packages/eval/src/evaluator.js";

describe("Evaluation Benchmark Suite Tests", () => {
  it("computes confusion matrix correctly", () => {
    const items = [
      { accountId: "A1", predicted: "FREEZE", expected: "FREEZE" },     // TP
      { accountId: "A2", predicted: "FREEZE", expected: "FREEZE" },     // TP
      { accountId: "A3", predicted: "FREEZE", expected: "NO_ACTION" },  // FP
      { accountId: "A4", predicted: "NO_ACTION", expected: "NO_ACTION" },// TN
      { accountId: "A5", predicted: "NO_ACTION", expected: "FREEZE" },  // FN
    ];

    const matrix = calculateConfusionMatrix(items);
    expect(matrix.tp).toBe(2);
    expect(matrix.fp).toBe(1);
    expect(matrix.tn).toBe(1);
    expect(matrix.fn).toBe(1);
  });

  it("calculates accuracy, precision, recall, F1, and FPR accurately", () => {
    const matrix = { tp: 8, fp: 2, tn: 8, fn: 2 };
    const metrics = calculateMetrics(matrix);

    expect(metrics.precision).toBeCloseTo(0.8, 2);
    expect(metrics.recall).toBeCloseTo(0.8, 2);
    expect(metrics.f1).toBeCloseTo(0.8, 2);
    expect(metrics.fpr).toBeCloseTo(0.2, 2);
    expect(metrics.accuracy).toBeCloseTo(0.8, 2);
  });

  it("handles edge cases in metrics calculation gracefully without NaN", () => {
    const zeroMatrix = { tp: 0, fp: 0, tn: 0, fn: 0 };
    const metrics = calculateMetrics(zeroMatrix);

    expect(Number.isNaN(metrics.precision)).toBe(false);
    expect(Number.isNaN(metrics.recall)).toBe(false);
    expect(Number.isNaN(metrics.f1)).toBe(false);
    expect(Number.isNaN(metrics.fpr)).toBe(false);
  });

  it("executes batch evaluation and proves Graph Agent superiority over Baseline (>25% margin)", async () => {
    const evalResults = await runBatchEvaluation();

    expect(evalResults).toBeDefined();
    expect(evalResults.graphMetrics).toBeDefined();
    expect(evalResults.baselineMetrics).toBeDefined();

    // Graph Agent should achieve >= 90% precision and recall with minimal FPR
    expect(evalResults.graphMetrics.precision).toBeGreaterThanOrEqual(0.9);
    expect(evalResults.graphMetrics.recall).toBeGreaterThanOrEqual(0.9);
    expect(evalResults.graphMetrics.fpr).toBeLessThanOrEqual(0.1);

    // Baseline should exhibit high FPR on Ring B and lower recall on Ring A
    expect(evalResults.baselineMetrics.fpr).toBeGreaterThan(0.3);
    expect(evalResults.baselineMetrics.recall).toBeLessThan(0.75);

    // Superiority margin > 25% (0.25)
    expect(evalResults.delta.precisionImprovement).toBeGreaterThan(0.25);
    expect(evalResults.delta.recallImprovement).toBeGreaterThan(0.25);
  });
});
