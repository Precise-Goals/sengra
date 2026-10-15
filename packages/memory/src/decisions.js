/**
 * @file packages/memory/src/decisions.js
 * @description Audit persistence and query engine for fraud investigation decisions.
 */

import { queryGraph, roQueryGraph } from "@sengra/graph";
import { getMemoryStore } from "./store.js";

/**
 * Persists an investigation decision with evidence path and confidence score.
 * @param {object} decisionData
 */
export async function saveDecision(decisionData) {
  const id = decisionData.id || `DEC_${Date.now()}`;
  const record = {
    id,
    caseId: decisionData.caseId || null,
    target: decisionData.target,
    decision: decisionData.decision,
    confidence: Number(decisionData.confidence || 0),
    policy: decisionData.policy || "freeze_policy_v1",
    explanation: decisionData.explanation || "",
    evidencePath: decisionData.evidencePath || [],
    cleared: Boolean(decisionData.cleared || decisionData.decision === "NO_ACTION"),
    timestamp: decisionData.timestamp || new Date().toISOString(),
  };

  // Cache in-memory store
  const store = getMemoryStore();
  store.decisions.set(id, record);

  // Attempt database persistence to decisions graph if connected
  try {
    const cypher = `
      MERGE (d:Decision {id: $id})
      SET d.caseId = $caseId,
          d.target = $target,
          d.decision = $decision,
          d.confidence = $confidence,
          d.policy = $policy,
          d.explanation = $explanation,
          d.evidencePath = $evidencePath,
          d.cleared = $cleared,
          d.timestamp = $timestamp
      RETURN d
    `;
    await queryGraph(cypher, record, "decisions");
  } catch (err) {
    // Falls back gracefully to memory store during offline/unit tests
  }

  return record;
}

/**
 * Retrieves all decisions for a target entity.
 * @param {string} targetEntityId
 */
export async function getDecisionsForEntity(targetEntityId) {
  const store = getMemoryStore();
  const localResults = Array.from(store.decisions.values()).filter(
    (d) => d.target === targetEntityId
  );

  try {
    const rows = await roQueryGraph(
      `MATCH (d:Decision {target: $target}) RETURN d ORDER BY d.timestamp DESC LIMIT 50`,
      { target: targetEntityId },
      "decisions"
    );
    if (rows && rows.length > 0) {
      const dbResults = rows.map((r) => r.d || r);
      // Merge unique
      const existingIds = new Set(localResults.map((d) => d.id));
      for (const d of dbResults) {
        if (!existingIds.has(d.id)) {
          localResults.push(d);
        }
      }
    }
  } catch (err) {
    // Database query error handled
  }

  return localResults;
}

export default {
  saveDecision,
  getDecisionsForEntity,
};
