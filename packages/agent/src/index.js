/**
 * @file Agent orchestration loop and baseline flat comparison runner.
 */

export const SYSTEM_PROMPT = `You are SENGRA, an autonomous financial crime intelligence agent.
Investigate alerts by querying the FalkorDB graph, testing hypotheses with skeptic challenge, and gating actions with deterministic policy.`;

/**
 * Creates an agent investigation loop.
 * @param {Record<string, any>} [config]
 */
export function createAgentLoop(config = {}) {
  return {
    systemPrompt: SYSTEM_PROMPT,
    config,
  };
}

export default {
  SYSTEM_PROMPT,
  createAgentLoop,
};
