/**
 * @file packages/memory/src/recall.js
 * @description Cross-session recall engine searching past investigations and clearance history.
 */

import { getDecisionsForEntity } from "./decisions.js";
import { getMemoryStore } from "./store.js";

/**
 * Searches past investigation history and clearances for an entity across previous sessions.
 * Allows Session 2 to cite Session 1's findings and avoid redundant or conflicting decisions.
 *
 * @param {string} entityId - Target entity ID (Account, Device, IP, Card)
 * @returns {Promise<Array<object>>} Historical investigation records
 */
export async function findPastInvestigations(entityId) {
  const decisions = await getDecisionsForEntity(entityId);
  const store = getMemoryStore();

  const history = decisions.map((d) => {
    const parentCase = d.caseId ? store.cases.get(d.caseId) : null;
    return {
      caseId: d.caseId,
      caseTitle: parentCase?.title || null,
      decisionId: d.id,
      target: d.target,
      decision: d.decision,
      confidence: d.confidence,
      policy: d.policy,
      explanation: d.explanation,
      evidencePath: d.evidencePath,
      cleared: Boolean(d.cleared || d.decision === "NO_ACTION"),
      timestamp: d.timestamp,
    };
  });

  return history;
}

export default {
  findPastInvestigations,
};
