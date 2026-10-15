/**
 * @file tests/unit/test-security.test.js
 * @description Unit tests for Security Bonus Layer: schema, CVE blast radius, and cross-domain fraud bridge.
 */

import { describe, it, expect } from "bun:test";
import {
  ServiceSchema,
  CVESchema,
  CredentialSchema,
} from "../../packages/schema/src/security.js";
import {
  cveToFraudLinks,
  calculateBlastRadius,
  evaluateFindingPriority,
  whoKnowsSystem,
} from "../../packages/tools/src/security.js";

describe("Security Bonus Layer Tests", () => {
  it("validates security Zod schemas correctly", () => {
    const validService = ServiceSchema.parse({
      id: "SVC-AUTH-PORTAL",
      name: "Authentication Gateway",
      tier: "TIER_0",
      exposed_via: "PUBLIC_INTERNET",
      repo: "org/auth-portal",
    });
    expect(validService.id).toBe("SVC-AUTH-PORTAL");

    const validCVE = CVESchema.parse({
      id: "CVE-2024-3094",
      cvss: 10.0,
      severity: "CRITICAL",
      description: "Backdoor in upstream xz-utils package allowing remote code execution.",
    });
    expect(validCVE.cvss).toBe(10.0);

    const validCredential = CredentialSchema.parse({
      id: "CRED-LEAKED-HASH",
      compromised: true,
      serviceId: "SVC-AUTH-PORTAL",
      accountId: "A-TAKEOVER-1",
    });
    expect(validCredential.compromised).toBe(true);
  });

  it("traces CVE-to-fraud bridge query connecting vulnerability to compromised accounts", () => {
    const bridgeResult = cveToFraudLinks({
      cveId: "CVE-2024-3094",
    });

    expect(bridgeResult.success).toBe(true);
    expect(bridgeResult.cveId).toBe("CVE-2024-3094");
    expect(bridgeResult.compromisedService).toBe("SVC-AUTH-PORTAL");
    expect(bridgeResult.compromisedAccounts.length).toBeGreaterThan(0);
    expect(bridgeResult.compromisedAccounts).toContain("A-TAKEOVER-1");
    expect(bridgeResult.fraudRiskLevel).toBe("CRITICAL");
    expect(bridgeResult.bridgePath.length).toBeGreaterThanOrEqual(4);
  });

  it("calculates downstream service blast radius accurately", () => {
    const blast = calculateBlastRadius({
      serviceId: "SVC-AUTH-PORTAL",
    });

    expect(blast.serviceId).toBe("SVC-AUTH-PORTAL");
    expect(blast.downstreamServices).toContain("SVC-PAYMENT-CORE");
    expect(blast.affectedDatastores).toContain("DB-USER-CREDENTIALS");
    expect(blast.totalImpactedEntities).toBeGreaterThan(3);
  });

  it("prioritizes vulnerabilities with fraud linkage as P0 Critical", () => {
    const fraudLinkedPriority = evaluateFindingPriority({
      cveId: "CVE-2024-3094",
      cvss: 10.0,
      isInternetExposed: true,
      hasCustomerPII: true,
      isFraudLinked: true,
    });

    expect(fraudLinkedPriority.priority).toBe("P0");
    expect(fraudLinkedPriority.score).toBeGreaterThanOrEqual(85);
    expect(fraudLinkedPriority.rationale).toContain("fraud");

    const internalUnlinkedPriority = evaluateFindingPriority({
      cveId: "CVE-2024-LOW-INT",
      cvss: 4.2,
      isInternetExposed: false,
      hasCustomerPII: false,
      isFraudLinked: false,
    });

    expect(internalUnlinkedPriority.priority).toBe("P3");
    expect(internalUnlinkedPriority.score).toBeLessThan(40);
  });

  it("resolves owning team and on-call engineer contacts", () => {
    const contacts = whoKnowsSystem({
      serviceId: "SVC-AUTH-PORTAL",
    });

    expect(contacts.owningTeam).toBe("Identity & Access SecOps");
    expect(contacts.onCallEngineer).toBeDefined();
    expect(contacts.pagerdutyChannel).toBeDefined();
  });
});
