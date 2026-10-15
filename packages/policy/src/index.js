/**
 * @file packages/policy/src/index.js
 * @description Pure deterministic fraud decision policy engine and Skeptic verification rules.
 */

export const DECISION_ACTIONS = {
  FREEZE: "FREEZE",
  HOLD: "HOLD",
  NO_ACTION: "NO_ACTION",
};

/**
 * Skeptic challenge: attempts to find benign explanations before executing destructive actions.
 * Detects family clusters sharing address and Wi-Fi without malicious indicators.
 * @param {object} context
 * @param {string} context.accountId
 * @param {Array<object>} [context.neighbors] - Connected entities
 * @param {Array<string>} [context.badDevices] - Known bad devices in neighborhood
 * @param {boolean} [context.hasCircularPayments] - Whether circular transfers exist
 * @param {boolean} [context.hasSharedAddress] - Whether address is shared with family
 * @param {boolean} [context.hasSharedIp] - Whether Wi-Fi IP is shared
 * @param {boolean} [context.previouslyCleared] - Past clearance record
 */
export function skepticCheck(context = {}) {
  const badDevices = context.badDevices || [];
  const hasCircular = Boolean(context.hasCircularPayments);
  const sharedAddress = Boolean(context.hasSharedAddress);
  const sharedIp = Boolean(context.hasSharedIp);
  const previouslyCleared = Boolean(context.previouslyCleared);

  // If memory already cleared this account and no new bad device appeared
  if (previouslyCleared && badDevices.length === 0) {
    return {
      isBenign: true,
      reason: "Account was previously investigated and cleared in historical case; no new malicious indicators.",
    };
  }

  // Family cluster pattern: shared residential address and home Wi-Fi with zero bad devices and no circular payments
  if (sharedAddress && sharedIp && badDevices.length === 0 && !hasCircular) {
    return {
      isBenign: true,
      reason: "Benign explanation identified: shared household address and home network with zero known-bad devices or circular loops (Family Cluster).",
    };
  }

  return {
    isBenign: false,
    reason: null,
  };
}

/**
 * Evaluates graph evidence against deterministic policy rules to decide whether to FREEZE, HOLD, or NO_ACTION.
 * Pure function: zero side-effects, unit-tested without database or LLM.
 *
 * Rule F4:
 * - FREEZE if:
 *     (1) Component contains >= 3 flagged accounts
 *     (2) Account is within 2 hops of a known-bad device
 *     (3) Not previously cleared in memory
 *     (4) Skeptic challenge returns isBenign: false
 * - HOLD if: evidence is partial or cross-check fails
 * - NO_ACTION if: benign explanation confirmed by Skeptic
 *
 * @param {object} context
 * @param {string} context.accountId - Target account ID
 * @param {number} context.flaggedInComponent - Number of flagged accounts in the connected component
 * @param {number} context.hopsToBadDevice - Shortest distance to a known-bad device (Infinity if none)
 * @param {boolean} [context.previouslyCleared] - Whether account was cleared previously
 * @param {Array<string>} [context.evidencePath] - Path traversed to justify finding
 * @param {boolean} [context.crossCheckPassed] - Whether FalkorDB WCC and Graphology components matched
 * @param {object} [context.skepticContext] - Inputs for skeptic verification
 */
export function evaluateFreezePolicy(context = {}) {
  const accountId = context.accountId || "UNKNOWN";
  const flaggedCount = context.flaggedInComponent || 0;
  const hopsToBadDevice = context.hopsToBadDevice !== undefined ? context.hopsToBadDevice : Infinity;
  const previouslyCleared = Boolean(context.previouslyCleared);
  const crossCheckPassed = context.crossCheckPassed !== undefined ? context.crossCheckPassed : true;
  const evidencePath = context.evidencePath || [];

  // Step 1: Run Skeptic challenge to test for benign explanations
  const skepticResult = skepticCheck({
    accountId,
    previouslyCleared,
    ...context.skepticContext,
  });

  if (skepticResult.isBenign) {
    return {
      decision: DECISION_ACTIONS.NO_ACTION,
      target: accountId,
      confidence: 0.92,
      policy: "freeze_policy_v1",
      explanation: `No action taken on account ${accountId}. ${skepticResult.reason}`,
      evidencePath,
      reasons: ["SKEPTIC_CLEARED", skepticResult.reason],
    };
  }

  // Step 2: Full Freeze Policy Evaluation
  const hasSubstantialRing = flaggedCount >= 3;
  const isCloseToBadDevice = hopsToBadDevice <= 2;

  if (hasSubstantialRing && isCloseToBadDevice && !previouslyCleared && crossCheckPassed) {
    return {
      decision: DECISION_ACTIONS.FREEZE,
      target: accountId,
      confidence: 0.95,
      policy: "freeze_policy_v1",
      explanation: `Account ${accountId} is part of a ${flaggedCount}-account flagged component and within ${hopsToBadDevice} hop(s) of known-bad device. Gated freeze approved.`,
      evidencePath,
      reasons: [
        `FLAGGED_COMPONENT_MEMBERS_${flaggedCount}`,
        `BAD_DEVICE_PROXIMITY_HOPS_${hopsToBadDevice}`,
        "NO_PRIOR_CLEARANCE",
      ],
    };
  }

  // Step 3: Partial Evidence -> Route to Human Review (HOLD)
  if (hasSubstantialRing || isCloseToBadDevice || !crossCheckPassed) {
    let holdReason = "Partial evidence detected: ";
    if (!crossCheckPassed) {
      holdReason += "FalkorDB and Graphology component discrepancy. ";
    }
    if (hasSubstantialRing && !isCloseToBadDevice) {
      holdReason += `Flagged ring detected (${flaggedCount} accounts) but distance to bad device is ${hopsToBadDevice} hops (> 2). `;
    }
    if (!hasSubstantialRing && isCloseToBadDevice) {
      holdReason += `Bad device within ${hopsToBadDevice} hops, but component has only ${flaggedCount} flagged accounts (< 3). `;
    }

    return {
      decision: DECISION_ACTIONS.HOLD,
      target: accountId,
      confidence: 0.65,
      policy: "freeze_policy_v1",
      explanation: `Account ${accountId} held for analyst review. ${holdReason}`,
      evidencePath,
      reasons: ["PARTIAL_EVIDENCE_HOLD", holdReason.trim()],
    };
  }

  // Default: insufficient evidence
  return {
    decision: DECISION_ACTIONS.NO_ACTION,
    target: accountId,
    confidence: 0.88,
    policy: "freeze_policy_v1",
    explanation: `Insufficient evidence to act on account ${accountId} (flagged accounts in cluster: ${flaggedCount}, hops to bad device: ${hopsToBadDevice}).`,
    evidencePath,
    reasons: ["INSUFFICIENT_EVIDENCE"],
  };
}

export default {
  DECISION_ACTIONS,
  skepticCheck,
  evaluateFreezePolicy,
};
