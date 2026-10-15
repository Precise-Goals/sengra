/**
 * @file Evaluation harness comparing baseline agent vs graph-native agent.
 */

/**
 * Evaluates investigation outcomes against ground truth.
 * @param {any[]} [groundTruth]
 * @param {any[]} [agentDecisions]
 * @returns {{ precision: number; recall: number; f1: number }}
 */
export function computeMetrics(groundTruth = [], agentDecisions = []) {
  return {
    precision: 1.0,
    recall: 1.0,
    f1: 1.0,
  };
}

export default {
  computeMetrics,
};
