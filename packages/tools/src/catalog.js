/**
 * @file packages/tools/src/catalog.js
 * @description Model Context Protocol (MCP) tool catalog definition for SENGRA fraud investigation.
 */

export const TOOL_CATALOG = [
  {
    name: "recall_entity",
    description: "Retrieve 1-hop or 2-hop graph neighborhood for an entity (Account, Device, IP, Card).",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Unique identifier of the entity to recall." },
        type: { type: "string", description: "Entity type (Account, Device, IPAddress, Card, Customer, Address)." },
        hops: { type: "integer", minimum: 1, maximum: 3, default: 1, description: "Graph traversal hop distance." },
      },
      required: ["id"],
    },
  },
  {
    name: "detect_communities",
    description: "Run graph community detection and component partitioning on a suspect subgraph.",
    parameters: {
      type: "object",
      properties: {
        componentId: { type: "string", description: "Optional component ID to partition." },
        algorithm: { type: "string", enum: ["louvain", "wcc"], default: "louvain", description: "Algorithm to execute." },
      },
    },
  },
  {
    name: "analyze_subgraph",
    description: "In-process Graphology topological analytics (Louvain communities, betweenness centrality, bridge detection).",
    parameters: {
      type: "object",
      properties: {
        nodes: {
          type: "array",
          items: { type: "object" },
          description: "List of graph nodes with { id, label, properties }.",
        },
        edges: {
          type: "array",
          items: { type: "object" },
          description: "List of graph edges with { source, target, type }.",
        },
        componentId: { type: "string", description: "Optional component ID to pull from database if nodes/edges not provided." },
      },
    },
  },
  {
    name: "shortest_path",
    description: "Compute the shortest graph path between two accounts or entities in FalkorDB.",
    parameters: {
      type: "object",
      properties: {
        a: { type: "string", description: "Source entity ID." },
        b: { type: "string", description: "Target entity ID." },
        maxHops: { type: "integer", minimum: 1, maximum: 6, default: 4, description: "Maximum search hops." },
      },
      required: ["a", "b"],
    },
  },
  {
    name: "skeptic_challenge",
    description: "Evaluate benign alternative explanations (family cluster sharing address/Wi-Fi, merchant hub, past clearance).",
    parameters: {
      type: "object",
      properties: {
        accountId: { type: "string", description: "Account ID being scrutinized." },
        hasSharedAddress: { type: "boolean", description: "Whether entity shares a residential address." },
        hasSharedIp: { type: "boolean", description: "Whether entity shares a home network IP." },
        badDevices: { type: "array", items: { type: "string" }, description: "List of known bad devices connected." },
        hasCircularPayments: { type: "boolean", description: "Whether circular money transfer loops exist." },
        previouslyCleared: { type: "boolean", description: "Whether cleared in historical audit case." },
      },
      required: ["accountId"],
    },
  },
  {
    name: "evaluate_freeze_policy",
    description: "Evaluate graph evidence against deterministic policy rules (Rule F4) to decide FREEZE, HOLD, or NO_ACTION.",
    parameters: {
      type: "object",
      properties: {
        accountId: { type: "string", description: "Account ID to evaluate." },
        flaggedInComponent: { type: "integer", description: "Count of flagged accounts in connected component." },
        hopsToBadDevice: { type: "number", description: "Distance to nearest known-bad device." },
        previouslyCleared: { type: "boolean", description: "Whether cleared in prior audit case." },
        crossCheckPassed: { type: "boolean", default: true, description: "Whether FalkorDB and Graphology WCC cross-check matched." },
        evidencePath: { type: "array", items: { type: "string" }, description: "Graph node IDs supporting evidence." },
      },
      required: ["accountId"],
    },
  },
  {
    name: "freeze_account",
    description: "Execute simulated account freeze action and log to audit ledger.",
    parameters: {
      type: "object",
      properties: {
        accountId: { type: "string", description: "Account ID to freeze." },
        decisionId: { type: "string", description: "ID of the approved policy decision." },
        reason: { type: "string", description: "Detailed rationale for the action." },
      },
      required: ["accountId"],
    },
  },
  {
    name: "open_case",
    description: "Create an active fraud investigation case record in agent memory.",
    parameters: {
      type: "object",
      properties: {
        caseId: { type: "string", description: "Unique identifier for case." },
        title: { type: "string", description: "Summary title of the investigation." },
        severity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "HIGH" },
        target: { type: "string", description: "Primary entity ID under investigation." },
      },
      required: ["title", "target"],
    },
  },
  {
    name: "notify",
    description: "Dispatch simulated risk alert or notification to compliance officers.",
    parameters: {
      type: "object",
      properties: {
        channel: { type: "string", enum: ["slack", "email", "webhook"], default: "slack" },
        severity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "HIGH" },
        message: { type: "string", description: "Notification body text." },
        target: { type: "string", description: "Entity identifier." },
      },
      required: ["message", "target"],
    },
  },
  {
    name: "record_decision",
    description: "Save final investigation decision, evidence path, and Cypher query to the decisions audit graph.",
    parameters: {
      type: "object",
      properties: {
        decision: { type: "string", enum: ["FREEZE", "HOLD", "NO_ACTION"], description: "Policy verdict." },
        target: { type: "string", description: "Entity ID evaluated." },
        confidence: { type: "number", minimum: 0, maximum: 1, description: "Confidence score." },
        policy: { type: "string", default: "freeze_policy_v1", description: "Policy version identifier." },
        explanation: { type: "string", description: "Human-readable explanation of verdict." },
        evidencePath: { type: "array", items: { type: "string" }, description: "Traversal node path." },
        cypher: { type: "string", description: "Cypher query executed during investigation." },
      },
      required: ["decision", "target", "confidence", "explanation"],
    },
  },
  {
    name: "run_cypher_readonly",
    description: "Execute a read-only Cypher query with row limit guardrails against FalkorDB.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Read-only Cypher query (no CREATE, DELETE, SET, etc.)." },
        params: { type: "object", description: "Parameterized bindings for the query." },
        limit: { type: "integer", minimum: 1, maximum: 1000, default: 100, description: "Maximum rows to return." },
      },
      required: ["query"],
    },
  },
  {
    name: "cve_to_fraud_links",
    description: "Trace cross-domain graph query connecting CVE vulnerability to compromised accounts via leaked credentials.",
    parameters: {
      type: "object",
      properties: {
        cveId: { type: "string", description: "CVE identifier (e.g. CVE-2024-3094)." },
        serviceId: { type: "string", description: "Vulnerable service ID." },
      },
    },
  },
  {
    name: "blast_radius",
    description: "Calculate downstream service dependencies and affected datastores from a compromised service.",
    parameters: {
      type: "object",
      properties: {
        serviceId: { type: "string", description: "Vulnerable service ID." },
      },
    },
  },
  {
    name: "evaluate_finding_priority",
    description: "Calculate finding priority score factoring in exposure, data sensitivity, and live fraud linkage.",
    parameters: {
      type: "object",
      properties: {
        cveId: { type: "string", description: "CVE identifier." },
        cvss: { type: "number", minimum: 0, maximum: 10, description: "CVSS base score." },
        isInternetExposed: { type: "boolean", description: "Whether service is exposed to public internet." },
        hasCustomerPII: { type: "boolean", description: "Whether service handles customer PII." },
        isFraudLinked: { type: "boolean", description: "Whether vulnerability is actively linked to financial fraud." },
      },
      required: ["cveId", "cvss"],
    },
  },
  {
    name: "who_knows_system",
    description: "Identify owning engineering team, tech lead, and on-call responders for incident paging.",
    parameters: {
      type: "object",
      properties: {
        serviceId: { type: "string", description: "Target service ID." },
      },
    },
  },
];

export default TOOL_CATALOG;
