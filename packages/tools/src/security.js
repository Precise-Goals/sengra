/**
 * @file packages/tools/src/security.js
 * @description Security validation and read-only query guardrails for Cypher execution.
 */

const FORBIDDEN_CYPHER_KEYWORDS = [
  /\bCREATE\b/i,
  /\bDELETE\b/i,
  /\bSET\b/i,
  /\bREMOVE\b/i,
  /\bMERGE\b/i,
  /\bDROP\b/i,
  /\bDETACH\b/i,
  /\bCALL\s+dbms/i,
  /\bALTER\b/i,
  /\bGRANT\b/i,
  /\bREVOKE\b/i,
];

const MAX_CYPHER_ROW_LIMIT = 1000;

/**
 * Asserts that a Cypher query is strictly read-only and within row limits.
 * Throws an error if any mutation keyword or unsafe limit is detected.
 * @param {string} query - Cypher query string
 * @param {number} [limit] - Explicit row limit
 * @throws {Error} If query is invalid, mutating, or exceeds limit
 */
export function assertReadOnlyCypher(query, limit = 1000) {
  if (!query || typeof query !== "string") {
    throw new Error("Cypher query must be a non-empty string.");
  }

  if (limit < 1 || limit > MAX_CYPHER_ROW_LIMIT) {
    throw new Error(`Row limit must be between 1 and ${MAX_CYPHER_ROW_LIMIT}. Received: ${limit}`);
  }

  for (const pattern of FORBIDDEN_CYPHER_KEYWORDS) {
    if (pattern.test(query)) {
      throw new Error(`Forbidden Cypher mutation keyword detected matching: ${pattern.source}`);
    }
  }

  // Extract explicit LIMIT in query if present
  const limitMatch = query.match(/\bLIMIT\s+(\d+)\b/i);
  if (limitMatch) {
    const parsedLimit = parseInt(limitMatch[1], 10);
    if (parsedLimit > MAX_CYPHER_ROW_LIMIT) {
      throw new Error(`Cypher query LIMIT (${parsedLimit}) exceeds maximum allowed (${MAX_CYPHER_ROW_LIMIT}).`);
    }
  }

  return true;
}

export default {
  assertReadOnlyCypher,
  MAX_CYPHER_ROW_LIMIT,
};
