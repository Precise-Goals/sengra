/**
 * @file Pure deterministic policy decision engine.
 */

export const DECISION_ACTIONS = Object.freeze({
  FREEZE: "FREEZE",
  HOLD: "HOLD",
  NO_ACTION: "NO_ACTION",
});

/**
 * Evaluates graph evidence against deterministic policy rules.
 * Pure function: 0 network, 0 side-effects.
 *
 * @param {{
 *   hasRing?: boolean;
 *   sharedDeviceCount?: number;
 *   skepticCleared?: boolean;
 *   crossCheckMatched?: boolean;
 * }} evidence
 * @returns {{ action: string; reason: string }}
 */
export function evaluatePolicy(evidence = {}) {
  if (evidence.skepticCleared) {
    return {
      action: DECISION_ACTIONS.NO_ACTION,
      reason: "Hypothesis cleared by skeptic challenge",
    };
  }
  if (evidence.hasRing && evidence.crossCheckMatched !== false) {
    return {
      action: DECISION_ACTIONS.FREEZE,
      reason: "Confirmed multi-node fraud ring with cross-check validation",
    };
  }
  if (evidence.sharedDeviceCount && evidence.sharedDeviceCount >= 2) {
    return {
      action: DECISION_ACTIONS.HOLD,
      reason: "Multiple shared devices detected; routed to human investigator",
    };
  }
  return {
    action: DECISION_ACTIONS.NO_ACTION,
    reason: "Insufficient risk signals",
  };
}

export default {
  DECISION_ACTIONS,
  evaluatePolicy,
};
