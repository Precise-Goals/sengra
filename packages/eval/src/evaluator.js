/**
 * @file packages/eval/src/evaluator.js
 * @description Quantitative evaluation benchmark suite and side-by-side comparison engine.
 */

import { GROUND_TRUTH } from "@sengra/data";
import { runInvestigation } from "@sengra/agent";
import { evaluateBaseline } from "./baseline.js";

/**
 * Calculates confusion matrix (TP, FP, TN, FN) from predictions against expected ground truths.
 *
 * @param {Array<{ accountId: string, predicted: string, expected: string }>} items
 * @returns {{ tp: number, fp: number, tn: number, fn: number, total: number }}
 */
export function calculateConfusionMatrix(items = []) {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  for (const item of items) {
    const isPredictedPositive = item.predicted === "FREEZE";
    const isExpectedPositive = item.expected === "FREEZE";

    if (isPredictedPositive && isExpectedPositive) {
      tp += 1;
    } else if (isPredictedPositive && !isExpectedPositive) {
      fp += 1;
    } else if (!isPredictedPositive && !isExpectedPositive) {
      tn += 1;
    } else {
      fn += 1;
    }
  }

  return {
    tp,
    fp,
    tn,
    fn,
    total: items.length,
  };
}

/**
 * Calculates quantitative accuracy metrics from a confusion matrix.
 *
 * @param {{ tp: number, fp: number, tn: number, fn: number }} matrix
 * @returns {{ precision: number, recall: number, f1: number, fpr: number, accuracy: number }}
 */
export function calculateMetrics(matrix = {}) {
  const tp = Number(matrix.tp || 0);
  const fp = Number(matrix.fp || 0);
  const tn = Number(matrix.tn || 0);
  const fn = Number(matrix.fn || 0);
  const total = tp + fp + tn + fn;

  const precision = tp + fp > 0 ? tp / (tp + fp) : 1.0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 1.0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0.0;
  const fpr = fp + tn > 0 ? fp / (fp + tn) : 0.0;
  const accuracy = total > 0 ? (tp + tn) / total : 1.0;

  return {
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1: Number(f1.toFixed(4)),
    fpr: Number(fpr.toFixed(4)),
    accuracy: Number(accuracy.toFixed(4)),
  };
}

/**
 * Generates the standardized evaluation dataset containing planted fraud rings, benign clusters, and clean controls.
 *
 * @returns {Array<object>}
 */
export function generateEvaluationScenarios() {
  const scenarios = [];

  // 1. Ring A: Multi-Hop Mule Ring (Expected: FREEZE)
  const ringA = GROUND_TRUTH.ringA || { accounts: [] };
  for (const accountId of ringA.accounts) {
    const isDirectBad = accountId === "A-RINGA-1" || accountId === "A-RINGA-2";
    const isCollector = accountId === ringA.collectorMule;

    scenarios.push({
      accountId,
      scenario: "Ring A: Mule Ring",
      expected: "FREEZE",
      // Graph Agent context
      graphContext: {
        accountId,
        flaggedInComponent: 8,
        hopsToBadDevice: isDirectBad ? 1 : 2,
        badDevices: ["D-17"],
        hasCircularPayments: isCollector,
        subgraph: {
          nodes: [{ id: accountId }, { id: "D-17" }, { id: "D-18" }],
          edges: [{ source: accountId, target: "D-17" }],
        },
      },
      // Baseline tabular context (Baseline misses collector mule & non-direct hops!)
      baselineRow: {
        accountId,
        directDeviceKnownBad: isDirectBad,
        sharedIpCount: 1,
        sharedAddressCount: 1,
      },
    });
  }

  // 2. Ring B: Benign Family Cluster (Expected: NO_ACTION)
  const ringB = GROUND_TRUTH.ringB || { accounts: [] };
  for (const accountId of ringB.accounts) {
    scenarios.push({
      accountId,
      scenario: "Ring B: Family Cluster",
      expected: "NO_ACTION",
      // Graph Agent context: Skeptic challenge clears shared home address/wifi
      graphContext: {
        accountId,
        hasSharedAddress: true,
        hasSharedIp: true,
        badDevices: [],
        hasCircularPayments: false,
        subgraph: {
          nodes: [{ id: accountId }, { id: ringB.sharedAddress }, { id: ringB.sharedIp }],
          edges: [{ source: accountId, target: ringB.sharedAddress }],
        },
      },
      // Baseline tabular context: Naively flags shared IP/address >= 3!
      baselineRow: {
        accountId,
        directDeviceKnownBad: false,
        sharedIpCount: ringB.accounts.length,
        sharedAddressCount: ringB.accounts.length,
      },
    });
  }

  // 3. Ring C: Account Takeover Chain (Expected: FREEZE)
  const ringC = GROUND_TRUTH.ringC || { accounts: [] };
  for (const accountId of ringC.accounts) {
    scenarios.push({
      accountId,
      scenario: "Ring C: Account Takeover",
      expected: "FREEZE",
      graphContext: {
        accountId,
        flaggedInComponent: 4,
        hopsToBadDevice: 1,
        badDevices: ["D-TAKEOVER-COMPROMISED"],
        subgraph: {
          nodes: [{ id: accountId }, { id: "D-TAKEOVER-COMPROMISED" }],
          edges: [{ source: accountId, target: "D-TAKEOVER-COMPROMISED" }],
        },
      },
      baselineRow: {
        accountId,
        directDeviceKnownBad: true,
        sharedIpCount: 1,
        sharedAddressCount: 1,
      },
    });
  }

  // 4. Background Clean Controls (Expected: NO_ACTION)
  for (let i = 1; i <= 5; i++) {
    const accountId = `A-CLEAN-${i}`;
    scenarios.push({
      accountId,
      scenario: "Clean Background Account",
      expected: "NO_ACTION",
      graphContext: {
        accountId,
        badDevices: [],
        hasSharedAddress: false,
        hasSharedIp: false,
        hasCircularPayments: false,
        hopsToBadDevice: Infinity,
        subgraph: {
          nodes: [{ id: accountId }],
          edges: [],
        },
      },
      baselineRow: {
        accountId,
        directDeviceKnownBad: false,
        sharedIpCount: 1,
        sharedAddressCount: 1,
      },
    });
  }

  return scenarios;
}

/**
 * Executes full batch evaluation over all test scenarios, comparing SENGRA Graph Agent against Baseline.
 *
 * @param {Array<object>} [customScenarios] - Optional override dataset
 * @returns {Promise<object>}
 */
export async function runBatchEvaluation(customScenarios) {
  const scenarios = customScenarios || generateEvaluationScenarios();

  const graphPredictions = [];
  const baselinePredictions = [];
  const detailedResults = [];

  for (const sc of scenarios) {
    // 1. Run Graph Agent
    const graphRes = await runInvestigation(sc.graphContext);
    const graphDecision = graphRes.decision;
    graphPredictions.push({
      accountId: sc.accountId,
      predicted: graphDecision,
      expected: sc.expected,
    });

    // 2. Run Baseline Agent
    const baselineRes = evaluateBaseline(sc.baselineRow);
    const baselineDecision = baselineRes.decision;
    baselinePredictions.push({
      accountId: sc.accountId,
      predicted: baselineDecision,
      expected: sc.expected,
    });

    detailedResults.push({
      accountId: sc.accountId,
      scenario: sc.scenario,
      expected: sc.expected,
      graphDecision,
      graphConfidence: graphRes.confidence,
      graphSkepticCleared: Boolean(graphRes.skepticCleared),
      baselineDecision,
      baselineConfidence: baselineRes.confidence,
      baselineIsFP: Boolean(baselineRes.isFalsePositive),
      baselineIsFN: Boolean(baselineRes.isFalseNegative),
      graphMatch: graphDecision === sc.expected,
      baselineMatch: baselineDecision === sc.expected,
    });
  }

  const graphMatrix = calculateConfusionMatrix(graphPredictions);
  const baselineMatrix = calculateConfusionMatrix(baselinePredictions);

  const graphMetrics = { ...calculateMetrics(graphMatrix), matrix: graphMatrix };
  const baselineMetrics = { ...calculateMetrics(baselineMatrix), matrix: baselineMatrix };

  const delta = {
    precisionImprovement: Number((graphMetrics.precision - baselineMetrics.precision).toFixed(4)),
    recallImprovement: Number((graphMetrics.recall - baselineMetrics.recall).toFixed(4)),
    f1Improvement: Number((graphMetrics.f1 - baselineMetrics.f1).toFixed(4)),
    fprReduction: Number((baselineMetrics.fpr - graphMetrics.fpr).toFixed(4)),
    accuracyImprovement: Number((graphMetrics.accuracy - baselineMetrics.accuracy).toFixed(4)),
  };

  const summary = `Graph Agent achieved Precision=${(graphMetrics.precision * 100).toFixed(1)}% ` +
    `and Recall=${(graphMetrics.recall * 100).toFixed(1)}% vs Baseline Precision=${(baselineMetrics.precision * 100).toFixed(1)}% ` +
    `and Recall=${(baselineMetrics.recall * 100).toFixed(1)}% (Margin: +${(delta.precisionImprovement * 100).toFixed(1)}% Precision, ` +
    `+${(delta.recallImprovement * 100).toFixed(1)}% Recall, -${(delta.fprReduction * 100).toFixed(1)}% FPR).`;

  return {
    scenariosCount: scenarios.length,
    graphMetrics,
    baselineMetrics,
    delta,
    summary,
    results: detailedResults,
  };
}

export default {
  calculateConfusionMatrix,
  calculateMetrics,
  generateEvaluationScenarios,
  runBatchEvaluation,
};
