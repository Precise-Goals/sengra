#!/usr/bin/env node
/**
 * @file packages/eval/src/cli.js
 * @description Standalone CLI runner for quantitative evaluation benchmarks comparing SENGRA to baseline.
 */

import { runBatchEvaluation } from "./evaluator.js";

async function main() {
  console.log("\n================================================================================");
  console.log("            SENGRA vs FLAT-TABLE BASELINE: QUANTITATIVE BENCHMARK              ");
  console.log("================================================================================\n");

  const startTime = Date.now();
  const results = await runBatchEvaluation();
  const elapsed = Date.now() - startTime;

  const { graphMetrics, baselineMetrics, delta, scenariosCount } = results;

  console.log(`Evaluated ${scenariosCount} benchmark accounts across Ring A, Ring B, Ring C, and Controls in ${elapsed}ms.\n`);

  console.log("--------------------------------------------------------------------------------");
  console.log("METRIC                     | SENGRA GRAPH AGENT | FLAT-TABLE BASELINE | DELTA");
  console.log("--------------------------------------------------------------------------------");

  const rows = [
    ["Precision", `${(graphMetrics.precision * 100).toFixed(1)}%`, `${(baselineMetrics.precision * 100).toFixed(1)}%`, `+${(delta.precisionImprovement * 100).toFixed(1)}%`],
    ["Recall (Sensitivity)", `${(graphMetrics.recall * 100).toFixed(1)}%`, `${(baselineMetrics.recall * 100).toFixed(1)}%`, `+${(delta.recallImprovement * 100).toFixed(1)}%`],
    ["F1 Score", graphMetrics.f1.toFixed(3), baselineMetrics.f1.toFixed(3), `+${delta.f1Improvement.toFixed(3)}`],
    ["False Positive Rate", `${(graphMetrics.fpr * 100).toFixed(1)}%`, `${(baselineMetrics.fpr * 100).toFixed(1)}%`, `-${(delta.fprReduction * 100).toFixed(1)}%`],
    ["Overall Accuracy", `${(graphMetrics.accuracy * 100).toFixed(1)}%`, `${(baselineMetrics.accuracy * 100).toFixed(1)}%`, `+${(delta.accuracyImprovement * 100).toFixed(1)}%`],
  ];

  for (const [name, graphVal, baseVal, diff] of rows) {
    console.log(
      `${name.padEnd(26)} | ${graphVal.padEnd(18)} | ${baseVal.padEnd(19)} | ${diff}`
    );
  }

  console.log("--------------------------------------------------------------------------------\n");

  console.log("CONFUSION MATRICES:");
  console.log(`  * SENGRA Graph Agent:   TP=${graphMetrics.matrix.tp}, FP=${graphMetrics.matrix.fp}, TN=${graphMetrics.matrix.tn}, FN=${graphMetrics.matrix.fn}`);
  console.log(`  * Flat-Table Baseline:  TP=${baselineMetrics.matrix.tp}, FP=${baselineMetrics.matrix.fp}, TN=${baselineMetrics.matrix.tn}, FN=${baselineMetrics.matrix.fn}\n`);

  console.log("SUMMARY:");
  console.log(`  ${results.summary}\n`);

  const passed = delta.precisionImprovement > 0.25 && delta.recallImprovement > 0.25;
  if (passed) {
    console.log("[PASS] SENGRA graph intelligence outperforms flat-table heuristics by > 25% margin.\n");
    process.exit(0);
  } else {
    console.error("[FAIL] Benchmark did not meet the required 25% superiority margin.\n");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Evaluation CLI encountered fatal error:", err);
  process.exit(1);
});
