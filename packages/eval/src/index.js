/**
 * @file packages/eval/src/index.js
 * @description Main export for @sengra/eval: baseline agent and comparative benchmarks.
 */

import { evaluateBaseline, compareAgentVsBaseline } from "./baseline.js";
import {
  calculateConfusionMatrix,
  calculateMetrics,
  generateEvaluationScenarios,
  runBatchEvaluation,
} from "./evaluator.js";

export {
  evaluateBaseline,
  compareAgentVsBaseline,
  calculateConfusionMatrix,
  calculateMetrics,
  generateEvaluationScenarios,
  runBatchEvaluation,
};

export default {
  evaluateBaseline,
  compareAgentVsBaseline,
  calculateConfusionMatrix,
  calculateMetrics,
  generateEvaluationScenarios,
  runBatchEvaluation,
};
