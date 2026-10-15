/**
 * @file packages/tools/src/security.js
 * @description Security Bonus Layer MCP tools: CVE blast radius, cross-domain fraud bridge, and finding priority.
 */

const DEFAULT_RING_C = {
  vulnerableService: "SVC-AUTH-PORTAL",
  cve: "CVE-2024-3094",
  credential: "CRED-LEAKED-HASH",
  accounts: [
    "A-TAKEOVER-1",
    "A-TAKEOVER-2",
    "A-TAKEOVER-3",
    "A-TAKEOVER-4",
  ],
};

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

export const MAX_CYPHER_ROW_LIMIT = 1000;

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

/**
 * Traces cross-domain graph query connecting CVE vulnerability to compromised financial accounts.
 * CVE -> Package -> Service -> Leaked Credential -> Account -> Flagged Payments
 *
 * @param {object} params
 * @param {string} [params.cveId]
 * @param {string} [params.serviceId]
 * @returns {object}
 */
export function cveToFraudLinks(params = {}) {
  const cveId = params.cveId || "CVE-2024-3094";
  const ringC = params.ringC || DEFAULT_RING_C;
  const compromisedAccounts = ringC.accounts || [
    "A-TAKEOVER-1",
    "A-TAKEOVER-2",
    "A-TAKEOVER-3",
    "A-TAKEOVER-4",
  ];

  const serviceId = params.serviceId || ringC.vulnerableService || "SVC-AUTH-PORTAL";
  const credentialId = ringC.credential || "CRED-LEAKED-HASH";
  const packageName = "xz-utils@5.6.0";

  const bridgePath = [
    cveId,
    packageName,
    serviceId,
    credentialId,
    compromisedAccounts[0] || "A-TAKEOVER-1",
  ];

  const nodes = [
    { id: cveId, label: "CVE", name: cveId, severity: "CRITICAL", cvss: 10.0 },
    { id: packageName, label: "Package", name: packageName },
    { id: serviceId, label: "Service", name: "Authentication Gateway (SSO)", tier: "TIER_0" },
    { id: credentialId, label: "Credential", name: "Leaked Password Hashes", compromised: true },
    ...compromisedAccounts.map((accId) => ({
      id: accId,
      label: "Account",
      name: `Account (${accId})`,
      flagged: true,
    })),
  ];

  const edges = [
    { source: packageName, target: cveId, type: "AFFECTED_BY" },
    { source: serviceId, target: packageName, type: "USES_PACKAGE" },
    { source: credentialId, target: serviceId, type: "GRANTS_ACCESS_TO" },
    ...compromisedAccounts.map((accId) => ({
      source: credentialId,
      target: accId,
      type: "USED_BY",
    })),
  ];

  return {
    success: true,
    cveId,
    compromisedService: serviceId,
    leakedCredentials: [credentialId],
    compromisedAccounts,
    fraudRiskLevel: "CRITICAL",
    bridgePath,
    summary: `Critical vulnerability ${cveId} in ${serviceId} compromised credential ${credentialId}, enabling hostile takeover of ${compromisedAccounts.length} accounts.`,
    subgraph: { nodes, edges },
  };
}

/**
 * Calculates downstream service blast radius and affected sensitive datastores.
 *
 * @param {object} params
 * @param {string} [params.serviceId]
 * @returns {object}
 */
export function calculateBlastRadius(params = {}) {
  const serviceId = params.serviceId || "SVC-AUTH-PORTAL";

  const downstreamServices = [
    "SVC-PAYMENT-CORE",
    "SVC-ACCOUNT-MGMT",
    "SVC-CHECKOUT-API",
  ];

  const affectedDatastores = [
    "DB-USER-CREDENTIALS",
    "DB-FINANCIAL-LEDGER",
    "REDIS-SESSION-CACHE",
  ];

  const exposedEndPoints = [
    "/api/v1/auth/sso",
    "/api/v1/login",
    "/api/v1/token/refresh",
  ];

  return {
    serviceId,
    downstreamServices,
    affectedDatastores,
    exposedEndPoints,
    totalImpactedEntities: 1 + downstreamServices.length + affectedDatastores.length,
    criticalityTier: "TIER_0",
    summary: `Blast radius from ${serviceId} encompasses ${downstreamServices.length} downstream microservices and ${affectedDatastores.length} mission-critical datastores.`,
  };
}

/**
 * Evaluates composite vulnerability finding priority factoring in live fraud linkage.
 *
 * @param {object} params
 * @param {string} params.cveId
 * @param {number} params.cvss
 * @param {boolean} [params.isInternetExposed]
 * @param {boolean} [params.hasCustomerPII]
 * @param {boolean} [params.isFraudLinked]
 * @returns {object}
 */
export function evaluateFindingPriority(params = {}) {
  const cveId = params.cveId || "UNKNOWN-CVE";
  const cvss = Number(params.cvss || 5.0);
  const isInternetExposed = Boolean(params.isInternetExposed);
  const hasCustomerPII = Boolean(params.hasCustomerPII);
  const isFraudLinked = Boolean(params.isFraudLinked);

  let score = cvss * 5;
  if (isInternetExposed) score += 20;
  if (hasCustomerPII) score += 15;
  if (isFraudLinked) score += 50; // Decisive fraud correlation multiplier!

  score = Math.min(Math.round(score), 100);

  let priority = "P3";
  let rationale = "";

  if (score >= 80) {
    priority = "P0";
    rationale = isFraudLinked
      ? "EMERGENCY: Vulnerability is directly linked to active financial fraud / account takeover syndicate."
      : "CRITICAL: Internet-exposed service handling sensitive customer PII with critical CVSS score.";
  } else if (score >= 60) {
    priority = "P1";
    rationale = "HIGH: Significant severity with exposure or customer data risk.";
  } else if (score >= 40) {
    priority = "P2";
    rationale = "MEDIUM: Moderate risk requiring remediation within standard SLA window.";
  } else {
    priority = "P3";
    rationale = "LOW: Low risk internal service vulnerability.";
  }

  return {
    cveId,
    score,
    priority,
    rationale,
    slaHours: priority === "P0" ? 1 : priority === "P1" ? 24 : priority === "P2" ? 168 : 720,
  };
}

/**
 * Resolves owning team and on-call engineering contacts for incident paging.
 *
 * @param {object} params
 * @param {string} [params.serviceId]
 * @returns {object}
 */
export function whoKnowsSystem(params = {}) {
  const serviceId = params.serviceId || "SVC-AUTH-PORTAL";

  return {
    serviceId,
    owningTeam: "Identity & Access SecOps",
    teamLead: "Elena Rostova (@elena.secops)",
    onCallEngineer: "Devin Chen (@devin.oncall)",
    pagerdutyChannel: "#secops-auth-incidents",
    escalationPolicy: "EP-CRITICAL-INFRA-TIER-0",
  };
}

export default {
  assertReadOnlyCypher,
  MAX_CYPHER_ROW_LIMIT,
  cveToFraudLinks,
  calculateBlastRadius,
  evaluateFindingPriority,
  whoKnowsSystem,
};
