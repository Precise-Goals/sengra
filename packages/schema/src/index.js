/**
 * @file packages/schema/src/index.js
 * @description Zod runtime schemas and validation types for SENGRA graph entities, relationships, tools, and decisions.
 */

import { z } from "zod";

// ==============================================================================
// 1. Domain Node Schemas
// ==============================================================================

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  riskScore: z.number().min(0).max(1).optional(),
});

export const AccountSchema = z.object({
  id: z.string(),
  flagged: z.boolean().default(false),
  frozen: z.boolean().default(false),
  createdAt: z.union([z.string(), z.number()]).optional(),
});

export const DeviceSchema = z.object({
  id: z.string(),
  known_bad: z.boolean().default(false),
  fingerprint: z.string().optional(),
});

export const IPAddressSchema = z.object({
  id: z.string(),
  ip: z.string(),
  isProxy: z.boolean().default(false),
});

export const CardSchema = z.object({
  id: z.string(),
  last4: z.string().length(4),
  expMonth: z.number().min(1).max(12).optional(),
  expYear: z.number().optional(),
});

export const AddressSchema = z.object({
  id: z.string(),
  street: z.string(),
  city: z.string(),
  zip: z.string(),
});

export const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  ts: z.union([z.string(), z.number()]),
  flagged: z.boolean().default(false),
});

export const MerchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
});

export const RuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

// Security Nodes & Tools (Bonus Layer)
export * from "./security.js";

// ==============================================================================
// 2. Generic Graph Subgraph Schemas
// ==============================================================================

export const GraphNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  properties: z.record(z.any()).default({}),
});

export const GraphEdgeSchema = z.object({
  id: z.string().optional(),
  source: z.string(),
  target: z.string(),
  type: z.string(),
  properties: z.record(z.any()).default({}),
});

export const SubgraphSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
});

// ==============================================================================
// 3. Decision & Audit Schemas
// ==============================================================================

export const DecisionActionEnum = z.enum(["FREEZE", "HOLD", "NO_ACTION"]);

export const DecisionSchema = z.object({
  id: z.string().optional(),
  decision: DecisionActionEnum,
  target: z.string(),
  confidence: z.number().min(0).max(1),
  policy: z.string().default("freeze_policy_v1"),
  explanation: z.string(),
  evidencePath: z.array(z.string()).default([]),
  cypher: z.string().optional(),
  memoryRefs: z.array(z.string()).default([]),
  toolsUsed: z.array(z.string()).default([]),
  timestamp: z.string().optional(),
});

// ==============================================================================
// 4. MCP Tool Input Schemas
// ==============================================================================

export const RecallEntityInputSchema = z.object({
  type: z.enum(["Account", "Device", "IPAddress", "Card", "Customer", "Address"]),
  id: z.string(),
});

export const GetNeighborsInputSchema = z.object({
  id: z.string(),
  hops: z.number().int().min(1).max(5).default(1),
  relTypes: z.array(z.string()).optional(),
});

export const FindLinkedAccountsInputSchema = z.object({
  id: z.string(),
  via: z.array(z.enum(["Device", "Card", "Address", "IPAddress"])).default(["Device", "Card", "Address"]),
});

export const FindRingsInputSchema = z.object({
  minSize: z.number().int().min(2).default(3),
});

export const RankCentralNodesInputSchema = z.object({
  componentId: z.string().optional(),
  topK: z.number().int().min(1).max(50).default(5),
});

export const AnalyzeSubgraphInputSchema = z.object({
  accountIds: z.array(z.string()).optional(),
  componentId: z.string().optional(),
});

export const ShortestPathInputSchema = z.object({
  a: z.string(),
  b: z.string(),
  maxHops: z.number().int().min(1).max(10).default(6),
});

export const SkepticChallengeInputSchema = z.object({
  accountId: z.string(),
});

export const EvaluateFreezePolicyInputSchema = z.object({
  accountId: z.string(),
});

export const FreezeAccountInputSchema = z.object({
  accountId: z.string(),
  decisionId: z.string().optional(),
  reason: z.string().optional(),
});

export const RunCypherReadonlyInputSchema = z.object({
  query: z.string().min(5),
  params: z.record(z.any()).default({}),
});
