/**
 * @file packages/agent/src/tools.js
 * @description Vercel AI SDK tool wrappers for SENGRA MCP tools.
 */

import { z } from "zod";
import { tool } from "ai";
import { executeTool } from "@sengra/tools";

/**
 * Creates AI SDK compatible tools dictionary for LLM tool calling.
 */
export function createAgentTools() {
  return {
    recall_entity: tool({
      description: "Retrieve 1-hop or 2-hop graph neighborhood for an entity (Account, Device, IP, Card).",
      parameters: z.object({
        id: z.string().describe("Entity identifier"),
        type: z.string().optional().describe("Entity type (Account, Device, IPAddress)"),
        hops: z.number().int().min(1).max(3).default(1).describe("Graph traversal distance"),
      }),
      execute: async (params) => {
        const res = await executeTool("recall_entity", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    detect_communities: tool({
      description: "Run graph community detection on a component.",
      parameters: z.object({
        componentId: z.string().optional(),
        algorithm: z.enum(["louvain", "wcc"]).default("louvain"),
      }),
      execute: async (params) => {
        const res = await executeTool("detect_communities", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    analyze_subgraph: tool({
      description: "In-process Graphology analysis (Louvain communities, betweenness centrality, bridge detection).",
      parameters: z.object({
        nodes: z.array(z.any()).optional().describe("Nodes array"),
        edges: z.array(z.any()).optional().describe("Edges array"),
        componentId: z.string().optional(),
      }),
      execute: async (params) => {
        const res = await executeTool("analyze_subgraph", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    shortest_path: tool({
      description: "Compute shortest path between two accounts or devices.",
      parameters: z.object({
        a: z.string(),
        b: z.string(),
        maxHops: z.number().default(4),
      }),
      execute: async (params) => {
        const res = await executeTool("shortest_path", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    skeptic_challenge: tool({
      description: "Test benign alternative explanations (family cluster sharing address/Wi-Fi with no bad devices).",
      parameters: z.object({
        accountId: z.string(),
        hasSharedAddress: z.boolean().optional(),
        hasSharedIp: z.boolean().optional(),
        badDevices: z.array(z.string()).optional(),
        hasCircularPayments: z.boolean().optional(),
        previouslyCleared: z.boolean().optional(),
      }),
      execute: async (params) => {
        const res = await executeTool("skeptic_challenge", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    evaluate_freeze_policy: tool({
      description: "Evaluate graph evidence against deterministic policy rules (Rule F4) to decide FREEZE, HOLD, or NO_ACTION.",
      parameters: z.object({
        accountId: z.string(),
        flaggedInComponent: z.number().int().optional(),
        hopsToBadDevice: z.number().optional(),
        previouslyCleared: z.boolean().optional(),
        crossCheckPassed: z.boolean().default(true),
        evidencePath: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        const res = await executeTool("evaluate_freeze_policy", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    freeze_account: tool({
      description: "Execute simulated account freeze action.",
      parameters: z.object({
        accountId: z.string(),
        decisionId: z.string().optional(),
        reason: z.string().optional(),
      }),
      execute: async (params) => {
        const res = await executeTool("freeze_account", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    open_case: tool({
      description: "Open fraud case record in memory.",
      parameters: z.object({
        caseId: z.string().optional(),
        title: z.string(),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("HIGH"),
        target: z.string(),
      }),
      execute: async (params) => {
        const res = await executeTool("open_case", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    notify: tool({
      description: "Dispatch risk notification alert.",
      parameters: z.object({
        channel: z.enum(["slack", "email", "webhook"]).default("slack"),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("HIGH"),
        message: z.string(),
        target: z.string(),
      }),
      execute: async (params) => {
        const res = await executeTool("notify", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    record_decision: tool({
      description: "Save final decision, evidence path, and Cypher query to decision graph.",
      parameters: z.object({
        decision: z.enum(["FREEZE", "HOLD", "NO_ACTION"]),
        target: z.string(),
        confidence: z.number().min(0).max(1),
        policy: z.string().default("freeze_policy_v1"),
        explanation: z.string(),
        evidencePath: z.array(z.string()).optional(),
        cypher: z.string().optional(),
      }),
      execute: async (params) => {
        const res = await executeTool("record_decision", params);
        return res.success ? res.data : { error: res.error };
      },
    }),

    run_cypher_readonly: tool({
      description: "Execute read-only Cypher query with row limits.",
      parameters: z.object({
        query: z.string(),
        params: z.record(z.any()).optional(),
        limit: z.number().int().min(1).max(1000).default(100),
      }),
      execute: async (params) => {
        const res = await executeTool("run_cypher_readonly", params);
        return res.success ? res.data : { error: res.error };
      },
    }),
  };
}

export default createAgentTools;
