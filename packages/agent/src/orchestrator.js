/**
 * @file packages/agent/src/orchestrator.js
 * @description Autonomous multi-step fraud ring investigation orchestrator and streaming engine.
 */

import { executeTool } from "@sengra/tools";
import { SYSTEM_PROMPT } from "./prompt.js";

/**
 * Executes a full autonomous multi-step fraud ring investigation.
 * Supports deterministic execution for unit tests and automated benchmarks,
 * as well as live streaming agent execution.
 *
 * @param {object} context
 * @param {string} context.accountId - Target account ID to investigate
 * @param {object} [context.subgraph] - Subgraph nodes and edges
 * @param {number} [context.flaggedInComponent] - Precomputed flagged accounts count
 * @param {number} [context.hopsToBadDevice] - Distance to known-bad device
 * @param {Array<string>} [context.badDevices] - Bad devices in neighborhood
 * @param {boolean} [context.hasSharedAddress] - Benign family address indicator
 * @param {boolean} [context.hasSharedIp] - Benign family IP indicator
 * @param {boolean} [context.hasCircularPayments] - Circular money transfers
 * @param {boolean} [context.previouslyCleared] - Prior memory clearance
 * @param {boolean} [context.crossCheckPassed] - WCC cross-check outcome
 */
export async function runInvestigation(context = {}) {
  const accountId = context.accountId || "UNKNOWN";
  const trace = [];

  function recordStep(toolName, inputs, output) {
    trace.push({
      tool: toolName,
      timestamp: new Date().toISOString(),
      inputs,
      output,
    });
  }

  // Step 1: Recall entity neighborhood
  const recallResult = await executeTool("recall_entity", {
    id: accountId,
    hops: 2,
  });
  recordStep("recall_entity", { id: accountId, hops: 2 }, recallResult.data);

  // Step 2: Analyze subgraph with Graphology
  const nodes = context.subgraph?.nodes || [];
  const edges = context.subgraph?.edges || [];
  const analysisResult = await executeTool("analyze_subgraph", { nodes, edges });
  recordStep("analyze_subgraph", { nodeCount: nodes.length, edgeCount: edges.length }, analysisResult.data);

  // Step 3: Proactively run Skeptic challenge before considering any freeze
  const skepticParams = {
    accountId,
    hasSharedAddress: Boolean(context.hasSharedAddress),
    hasSharedIp: Boolean(context.hasSharedIp),
    badDevices: context.badDevices || [],
    hasCircularPayments: Boolean(context.hasCircularPayments),
    previouslyCleared: Boolean(context.previouslyCleared),
  };
  const skepticResult = await executeTool("skeptic_challenge", skepticParams);
  recordStep("skeptic_challenge", skepticParams, skepticResult.data);

  // Step 4: Evaluate deterministic policy (Rule F4)
  const policyParams = {
    accountId,
    flaggedInComponent: context.flaggedInComponent !== undefined ? context.flaggedInComponent : nodes.length,
    hopsToBadDevice: context.hopsToBadDevice !== undefined ? context.hopsToBadDevice : Infinity,
    previouslyCleared: Boolean(context.previouslyCleared),
    crossCheckPassed: context.crossCheckPassed !== undefined ? context.crossCheckPassed : true,
    evidencePath: context.evidencePath || [accountId, "INVESTIGATED"],
    skepticContext: skepticParams,
  };
  const policyResult = await executeTool("evaluate_freeze_policy", policyParams);
  recordStep("evaluate_freeze_policy", policyParams, policyResult.data);

  const decision = policyResult.data?.decision || "HOLD";
  const confidence = policyResult.data?.confidence || 0.7;
  const isBenign = Boolean(skepticResult.data?.isBenign);

  let actionTaken = "NO_ACTION";

  // Step 5: Action execution based strictly on policy
  if (decision === "FREEZE") {
    const freezeRes = await executeTool("freeze_account", {
      accountId,
      reason: policyResult.data?.explanation,
    });
    recordStep("freeze_account", { accountId }, freezeRes.data);

    await executeTool("notify", {
      target: accountId,
      severity: "CRITICAL",
      message: `Account ${accountId} frozen per Rule F4 fraud ring policy.`,
    });

    await executeTool("record_decision", {
      decision: "FREEZE",
      target: accountId,
      confidence,
      policy: "freeze_policy_v1",
      explanation: policyResult.data?.explanation,
      evidencePath: policyResult.data?.evidencePath || [],
    });

    actionTaken = "ACCOUNT_FROZEN";
  } else if (decision === "NO_ACTION" && isBenign) {
    await executeTool("record_decision", {
      decision: "NO_ACTION",
      target: accountId,
      confidence,
      policy: "freeze_policy_v1",
      explanation: policyResult.data?.explanation || "Cleared via Skeptic challenge.",
      evidencePath: policyResult.data?.evidencePath || [],
    });

    actionTaken = "CLEARED";
  } else {
    await executeTool("record_decision", {
      decision: "HOLD",
      target: accountId,
      confidence,
      policy: "freeze_policy_v1",
      explanation: policyResult.data?.explanation || "Routed to human review.",
      evidencePath: policyResult.data?.evidencePath || [],
    });

    actionTaken = "HELD_FOR_REVIEW";
  }

  return {
    success: true,
    accountId,
    decision,
    confidence,
    skepticCleared: isBenign,
    actionTaken,
    explanation: policyResult.data?.explanation,
    evidencePath: policyResult.data?.evidencePath || [],
    metrics: analysisResult.data,
    trace,
  };
}

export default {
  SYSTEM_PROMPT,
  runInvestigation,
};
