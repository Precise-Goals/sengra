/**
 * @file packages/data/src/generator.js
 * @description Deterministic synthetic data generator for SENGRA with planted fraud rings and noise.
 */

import { faker } from "@faker-js/faker";
import { GROUND_TRUTH } from "./ground-truth.js";

/**
 * Generates deterministic graph entities and relationships.
 * @param {number} seed - Fixed PRNG seed
 * @param {object} options - Generation scaling options
 */
export function generateSyntheticData(seed = 42, options = {}) {
  faker.seed(seed);

  const totalNoiseAccounts = options.noiseAccounts || 450;
  const nodes = [];
  const edges = [];

  // Helper to add node
  const addNode = (id, label, properties = {}) => {
    nodes.push({ id, label, properties: { id, ...properties } });
  };

  // Helper to add edge
  const addEdge = (source, target, type, properties = {}) => {
    edges.push({
      id: `${source}-${type}-${target}-${edges.length}`,
      source,
      target,
      type,
      properties,
    });
  };

  // ============================================================================
  // 1. Planted Ring A: Mule Ring
  // ============================================================================
  const ringA = GROUND_TRUTH.ringA;
  addNode(ringA.badDevices[0], "Device", { known_bad: true, fingerprint: "fp-bad-android-01" });
  addNode(ringA.devices[1], "Device", { known_bad: false, fingerprint: "fp-mule-shared-02" });

  ringA.accounts.forEach((accId, idx) => {
    const isCollector = accId === ringA.collectorMule;
    addNode(accId, "Account", {
      flagged: true,
      frozen: false,
      isCollector,
      role: isCollector ? "collector" : "mule",
    });

    // Connect to shared devices
    addEdge(accId, ringA.badDevices[0], "USES");
    if (idx % 2 === 0) {
      addEdge(accId, ringA.devices[1], "USES");
    }
  });

  // Circular and funnel payments to collector mule
  for (let i = 0; i < ringA.accounts.length - 1; i++) {
    const from = ringA.accounts[i];
    const to = ringA.accounts[i + 1];
    addEdge(from, to, "PAID_TO", { amount: 480 + i * 20, ts: "2026-10-15T12:00:00Z" });
    // Also direct payment to collector
    if (i < ringA.accounts.length - 2) {
      addEdge(from, ringA.collectorMule, "PAID_TO", { amount: 1200, ts: "2026-10-15T12:30:00Z" });
    }
  }

  // ============================================================================
  // 2. Planted Ring B: Family Cluster (Benign False Positive Test)
  // ============================================================================
  const ringB = GROUND_TRUTH.ringB;
  addNode(ringB.sharedAddress, "Address", { street: "742 Evergreen Terrace", city: "Springfield", zip: "97477" });
  addNode(ringB.sharedIp, "IPAddress", { ip: "192.168.1.1", isProxy: false });

  ringB.accounts.forEach((accId, idx) => {
    addNode(accId, "Account", { flagged: false, frozen: false });
    addNode(`DEV-FAMILY-${idx}`, "Device", { known_bad: false });
    addEdge(accId, `DEV-FAMILY-${idx}`, "USES");
    addEdge(accId, ringB.sharedAddress, "LIVES_AT");
    addEdge(accId, ringB.sharedIp, "LOGGED_IN_FROM");
  });

  // Legitimate family transfers
  addEdge(ringB.accounts[0], ringB.accounts[1], "PAID_TO", { amount: 50, ts: "2026-10-10T08:00:00Z" });
  addEdge(ringB.accounts[0], ringB.accounts[2], "PAID_TO", { amount: 25, ts: "2026-10-11T09:00:00Z" });

  // ============================================================================
  // 3. Planted Ring C: Account Takeover Chain (Security Bonus Layer)
  // ============================================================================
  const ringC = GROUND_TRUTH.ringC;
  addNode(ringC.vulnerableService, "Service", { exposed: true, port: 443 });
  addNode(ringC.cve, "CVE", { cvss: 9.8, severity: "CRITICAL" });
  addNode(ringC.credential, "Credential", { leaked: true, type: "auth_token" });
  addEdge(ringC.vulnerableService, ringC.cve, "AFFECTED_BY");
  addEdge(ringC.credential, ringC.vulnerableService, "GRANTS_ACCESS_TO");

  ringC.accounts.forEach((accId) => {
    addNode(accId, "Account", { flagged: true, frozen: false, compromised: true });
    addEdge(ringC.credential, accId, "USED_BY");
    addEdge(accId, ringA.collectorMule, "PAID_TO", { amount: 2500, ts: "2026-10-15T14:00:00Z" });
  });

  // ============================================================================
  // 4. Background Normal Entities & Transactions (Noise)
  // ============================================================================
  const merchants = [
    { id: "M-COFFEE-01", name: "Starbucks Reserve", category: "Coffee" },
    { id: "M-GROCERY-02", name: "Whole Foods Market", category: "Grocery" },
    { id: "M-RIDESHARE-03", name: "Uber Technologies", category: "Transport" },
    { id: "M-RETAIL-04", name: "Amazon Marketplace", category: "Retail" },
  ];
  merchants.forEach(m => addNode(m.id, "Merchant", m));

  for (let i = 0; i < totalNoiseAccounts; i++) {
    const accId = `A-NORM-${String(i).padStart(4, "0")}`;
    const devId = `D-NORM-${String(i % 150).padStart(4, "0")}`;
    const ipId = `IP-NORM-${String(i % 100).padStart(4, "0")}`;
    const addrId = `ADDR-NORM-${String(i % 200).padStart(4, "0")}`;

    addNode(accId, "Account", { flagged: false, frozen: false });
    if (i < 150) addNode(devId, "Device", { known_bad: false });
    if (i < 100) addNode(ipId, "IPAddress", { ip: `10.0.${Math.floor(i / 10)}.${i % 10}`, isProxy: false });
    if (i < 200) addNode(addrId, "Address", { street: faker.location.streetAddress(), city: "Seattle", zip: "98101" });

    addEdge(accId, devId, "USES");
    addEdge(accId, ipId, "LOGGED_IN_FROM");
    addEdge(accId, addrId, "LIVES_AT");

    // Merchant purchase
    const m = merchants[i % merchants.length];
    const txnId = `TXN-NORM-${String(i).padStart(4, "0")}`;
    addNode(txnId, "Transaction", { amount: 15 + (i % 80), ts: "2026-10-14T10:00:00Z", flagged: false });
    addEdge(accId, txnId, "FROM");
    addEdge(txnId, m.id, "TO");
  }

  return {
    nodes,
    edges,
    summary: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      ringAAccounts: ringA.accounts.length,
      ringBAccounts: ringB.accounts.length,
      ringCAccounts: ringC.accounts.length,
      noiseAccounts: totalNoiseAccounts,
    },
    groundTruth: GROUND_TRUTH,
  };
}

export default generateSyntheticData;
