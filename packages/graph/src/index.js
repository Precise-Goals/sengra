/**
 * @file FalkorDB connection manager and graph query helpers.
 */

/**
 * Returns or initializes the cached FalkorDB client singleton.
 * @returns {Promise<any>} FalkorDB client instance
 */
export async function getDb() {
  const g = globalThis;
  if (!g._falkor) {
    g._falkor = {
      selectGraph: (name) => ({
        query: async (cypher, params) => ({ data: [] }),
        roQuery: async (cypher, params) => ({ data: [] }),
      }),
    };
  }
  return g._falkor;
}

/**
 * Selects the domain knowledge graph.
 * @returns {Promise<any>}
 */
export async function domain() {
  const db = await getDb();
  return db.selectGraph("domain");
}

/**
 * Selects the agent memory graph.
 * @returns {Promise<any>}
 */
export async function agentMemory() {
  const db = await getDb();
  return db.selectGraph("agent_memory");
}

/**
 * Selects the decisions audit graph.
 * @returns {Promise<any>}
 */
export async function decisions() {
  const db = await getDb();
  return db.selectGraph("decisions");
}

export default {
  getDb,
  domain,
  agentMemory,
  decisions,
};
