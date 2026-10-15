/**
 * @file MCP tool definitions and execution handlers.
 */

export const AVAILABLE_TOOLS = [
  "recall_entity",
  "get_neighbors",
  "find_linked_accounts",
  "find_rings",
  "rank_central_nodes",
  "detect_communities",
  "shortest_path",
  "challenge_fraud_hypothesis",
  "evaluate_policy_gate",
  "execute_action",
  "record_decision",
  "run_cypher_readonly",
];

/**
 * Lists available tools in the registry.
 * @returns {string[]}
 */
export function listTools() {
  return [...AVAILABLE_TOOLS];
}

export default {
  AVAILABLE_TOOLS,
  listTools,
};
