/**
 * @file packages/graph/src/index.js
 * @description FalkorDB Cloud client singleton with TLS configuration, connection caching on globalThis, and graph accessors.
 */

import { FalkorDB } from "falkordb";

/**
 * Returns the cached FalkorDB client singleton or connects if not present.
 * Uses globalThis caching to survive serverless warm restarts.
 */
export async function getDb(options = {}) {
  const g = globalThis;
  if (!g._falkor) {
    const host = options.host || process.env.FALKORDB_HOST || "localhost";
    const port = Number(options.port || process.env.FALKORDB_PORT || 6379);
    const username = options.username || process.env.FALKORDB_USERNAME || "default";
    const password = options.password || process.env.FALKORDB_PASSWORD || "";
    const isTls = options.tls !== undefined ? Boolean(options.tls) : process.env.FALKORDB_TLS === "true";

    g._falkor = await FalkorDB.connect({
      username,
      password,
      socket: {
        host,
        port,
        tls: isTls,
      },
    });
  }
  return g._falkor;
}

/**
 * Resolves graph name with environment prefix (e.g. 'dev_domain', 'test_domain').
 * @param {string} base - Base graph name ('domain', 'agent_memory', 'decisions')
 * @returns {string} Prefixed graph name
 */
export function getGraphName(base) {
  const prefix = process.env.FALKORDB_GRAPH_PREFIX !== undefined ? process.env.FALKORDB_GRAPH_PREFIX : "dev_";
  return `${prefix}${base}`;
}

/**
 * Selects a graph by base name using the active prefix.
 * @param {string} base
 */
export async function selectGraph(base, options = {}) {
  const client = await getDb(options);
  const fullName = getGraphName(base);
  return client.selectGraph(fullName);
}

/** Access the primary domain fraud graph ('domain'). */
export async function domain(options = {}) {
  return selectGraph("domain", options);
}

/** Access the cross-session agent memory graph ('agent_memory'). */
export async function agentMemory(options = {}) {
  return selectGraph("agent_memory", options);
}

/** Access the immutable decision and audit graph ('decisions'). */
export async function decisions(options = {}) {
  return selectGraph("decisions", options);
}

/**
 * Executes a parameterized query on the target graph partition.
 * @param {string} base - Target graph base ('domain', 'agent_memory', 'decisions')
 * @param {string} cypher - Cypher query string with parameter placeholders
 * @param {Record<string, any>} params - Parameter bindings
 */
export async function queryGraph(base, cypher, params = {}) {
  const graph = await selectGraph(base);
  return graph.query(cypher, { params });
}

/**
 * Executes a read-only parameterized query using FalkorDB roQuery method.
 * Guarantees database-level mutation rejection.
 * @param {string} base
 * @param {string} cypher
 * @param {Record<string, any>} params
 */
export async function roQueryGraph(base, cypher, params = {}) {
  const graph = await selectGraph(base);
  return graph.roQuery(cypher, { params });
}

export default {
  getDb,
  getGraphName,
  selectGraph,
  domain,
  agentMemory,
  decisions,
  queryGraph,
  roQueryGraph,
};
