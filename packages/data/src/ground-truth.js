/**
 * @file packages/data/src/ground-truth.js
 * @description Ground truth definitions for planted synthetic fraud rings and benign clusters.
 */

export const GROUND_TRUTH = {
  ringA: {
    id: "RING-A-MULE",
    name: "Mule Ring",
    type: "fraud_ring",
    expectedVerdict: "FREEZE",
    collectorMule: "A-RINGA-COLLECTOR",
    badDevices: ["D-17"],
    devices: ["D-17", "D-18"],
    accounts: [
      "A-RINGA-1",
      "A-RINGA-2",
      "A-RINGA-3",
      "A-RINGA-4",
      "A-RINGA-5",
      "A-RINGA-6",
      "A-RINGA-7",
      "A-RINGA-COLLECTOR",
    ],
    explanation: "8-account mule ring sharing known-bad device D-17 with circular payments terminating in collector mule.",
  },
  ringB: {
    id: "RING-B-FAMILY",
    name: "Family Cluster",
    type: "benign_cluster",
    expectedVerdict: "NO_ACTION",
    sharedAddress: "ADDR-FAMILY-01",
    sharedIp: "IP-FAMILY-WIFI",
    badDevices: [],
    accounts: [
      "A-RINGB-1",
      "A-RINGB-2",
      "A-RINGB-3",
      "A-RINGB-4",
      "A-RINGB-5",
    ],
    explanation: "5 accounts sharing family address and home Wi-Fi with no bad devices or circular flow; benign cluster.",
  },
  ringC: {
    id: "RING-C-TAKEOVER",
    name: "Account Takeover Chain",
    type: "security_fraud_bridge",
    expectedVerdict: "FREEZE",
    vulnerableService: "SVC-AUTH-PORTAL",
    cve: "CVE-2024-3094",
    credential: "CRED-LEAKED-HASH",
    accounts: [
      "A-TAKEOVER-1",
      "A-TAKEOVER-2",
      "A-TAKEOVER-3",
      "A-TAKEOVER-4",
    ],
    explanation: "Exposed auth service with critical CVE leaked credentials enabling takeover of 4 active accounts.",
  },
};

export default GROUND_TRUTH;
