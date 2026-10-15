/**
 * @file packages/memory/src/cases.js
 * @description Case creation, storage, and retrieval in FalkorDB agent_memory and local cache.
 */

import { queryGraph, roQueryGraph } from "@sengra/graph";
import { getMemoryStore } from "./store.js";

/**
 * Persists an investigation case.
 * @param {object} caseData
 * @param {string} caseData.caseId - Unique case ID
 * @param {string} caseData.title - Case title
 * @param {string} caseData.target - Target account or entity ID
 * @param {string} [caseData.severity] - Case severity
 * @param {string} [caseData.status] - Status (OPEN, CLOSED, RESOLVED)
 */
export async function saveCase(caseData) {
  const caseId = caseData.caseId || `CASE_${Date.now()}`;
  const record = {
    caseId,
    title: caseData.title,
    target: caseData.target,
    severity: caseData.severity || "HIGH",
    status: caseData.status || "OPEN",
    createdAt: caseData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Cache in-memory store
  const store = getMemoryStore();
  store.cases.set(caseId, record);

  // Attempt database persistence to agent_memory graph if connected
  try {
    const cypher = `
      MERGE (c:Case {id: $caseId})
      SET c.title = $title,
          c.target = $target,
          c.severity = $severity,
          c.status = $status,
          c.createdAt = $createdAt,
          c.updatedAt = $updatedAt
      RETURN c
    `;
    await queryGraph(cypher, record, "agent_memory");
  } catch (err) {
    // Falls back gracefully to memory store during offline/unit tests
  }

  return record;
}

/**
 * Retrieves a case by caseId.
 * @param {string} caseId
 */
export async function getCase(caseId) {
  const store = getMemoryStore();
  if (store.cases.has(caseId)) {
    return store.cases.get(caseId);
  }

  try {
    const rows = await roQueryGraph(
      `MATCH (c:Case {id: $caseId}) RETURN c LIMIT 1`,
      { caseId },
      "agent_memory"
    );
    if (rows && rows.length > 0) {
      return rows[0].c || rows[0];
    }
  } catch (err) {
    // Database query error handled
  }

  return null;
}

export default {
  saveCase,
  getCase,
};
