---
status: complete
owner: po-spec
task: T-0013
inputs: ["harness/tasks/T-0013.md", "docs/raw.md"]
acceptance_refs: ["AC-014-a", "AC-014-b", "AC-014-c", "AC-014-d"]
---

# 01-spec: Specification for Security Bonus Layer & Cross-Domain Bridge Query

## Goal
Bridge the cybersecurity domain (CVEs, vulnerable services, leaked credentials) with the financial fraud domain (compromised accounts, unauthorized transfers) using graph connectivity, enabling proactive fraud interception before funds leave the ecosystem.

## Key Requirements
1. Zod Schemas (`@sengra/schema`):
   - `ServiceSchema`: id, name, tier, repo, exposed_via.
   - `CVESchema`: id (e.g. `CVE-2024-3094`), severity, cvss, description.
   - `CredentialSchema`: id, hash, compromised, leaked_at.
   - `BlastRadiusSchema`: downstreamServices, affectedDatastores, exposedEndPoints.
   - `FindingPrioritySchema`: priority (P0/P1/P2/P3), score, rationale.
2. Security MCP Tools (`@sengra/tools`):
   - `cve_to_fraud_links`: Cross-domain bridge traversal returning `{ cve, service, credentials, compromisedAccounts, fraudRiskLevel }`.
   - `blast_radius`: Traverses downstream dependency tree from vulnerable service.
   - `evaluate_finding_priority`: Computes composite vulnerability score with fraud multiplier.
   - `who_knows_system`: Resolves owning team and on-call engineers for incident paging.
3. Interactive Console (`apps/web/src/app/security/page.jsx`):
   - Dark ops security console showing the full cross-domain bridge query visualization, blast radius inspection, and one-click mitigation.
