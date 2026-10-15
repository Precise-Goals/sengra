/**
 * @file packages/tools/src/index.js
 * @description Main export for @sengra/tools: tool catalog, dispatcher, validation, and security guards.
 */

import { TOOL_CATALOG } from "./catalog.js";
import { TOOL_HANDLERS } from "./handlers.js";
import { assertReadOnlyCypher } from "./security.js";

/**
 * Validates tool parameters against the catalog's required fields.
 * @param {string} toolName
 * @param {object} params
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateToolParams(toolName, params = {}) {
  const tool = TOOL_CATALOG.find(t => t.name === toolName);
  if (!tool) {
    return { valid: false, errors: [`Unknown tool: ${toolName}`] };
  }

  const errors = [];
  const required = tool.parameters?.required || [];
  for (const field of required) {
    if (params[field] === undefined || params[field] === null || params[field] === "") {
      errors.push(`Missing required parameter: '${field}' for tool '${toolName}'.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Executes a tool by name with the given parameters.
 * @param {string} toolName
 * @param {object} params
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function executeTool(toolName, params = {}) {
  const validation = validateToolParams(toolName, params);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join("; "),
    };
  }

  const handler = TOOL_HANDLERS[toolName];
  if (!handler) {
    return {
      success: false,
      error: `No handler registered for tool: ${toolName}`,
    };
  }

  try {
    const data = await handler(params);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

export {
  TOOL_CATALOG,
  TOOL_HANDLERS,
  assertReadOnlyCypher,
};

export default {
  TOOL_CATALOG,
  TOOL_HANDLERS,
  executeTool,
  validateToolParams,
  assertReadOnlyCypher,
};
