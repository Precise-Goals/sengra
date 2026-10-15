/**
 * @file packages/agent/src/index.js
 * @description Main export for @sengra/agent: system prompt, AI SDK tools, and investigation orchestrator.
 */

import { SYSTEM_PROMPT } from "./prompt.js";
import { createAgentTools } from "./tools.js";
import { runInvestigation } from "./orchestrator.js";

export {
  SYSTEM_PROMPT,
  createAgentTools,
  runInvestigation,
};

export default {
  SYSTEM_PROMPT,
  createAgentTools,
  runInvestigation,
};
