---
status: complete
owner: designer
task: T-0013
inputs: ["harness/artifacts/T-0013/01-spec.md"]
acceptance_refs: ["AC-014-a", "AC-014-b", "AC-014-c", "AC-014-d"]
---

# 02-design: Architecture & Data Flow for Security Bonus Layer

## Cross-Domain Graph Schema
```
(CVE: { id: "CVE-2024-3094", cvss: 10.0, severity: "CRITICAL" })
    ^
    | [:AFFECTED_BY]
(Package: { name: "xz-utils", version: "5.6.0" })
    ^
    | [:USES_PACKAGE]
(Service: { id: "SVC-AUTH-PORTAL", name: "SSO Gateway", tier: "TIER_0" })
    ^
    | [:GRANTS_ACCESS_TO]
(Credential: { id: "CRED-LEAKED-HASH", compromised: true })
    |
    | [:USED_BY]
    v
(Account: { id: "A-TAKEOVER-1" }) ---> [:PAID_TO] ---> (Account: { id: "A-MULE-EXIT" })
```

## Finding Priority Algorithm
$$\text{Priority Score} = (\text{CVSS} \times 5) + (\text{Internet Exposed} \ ?\ 20 : 0) + (\text{Customer PII Exposed} \ ?\ 15 : 0) + (\text{Fraud Linked} \ ?\ 50 : 0)$$
- Score $\ge 80 \implies \text{P0 CRITICAL}$ (Emergency PagerDuty + Automated Credential Revocation).
- Score $60 - 79 \implies \text{P1 HIGH}$ (24h SLA).
- Score $40 - 59 \implies \text{P2 MEDIUM}$ (7d SLA).
- Score $< 40 \implies \text{P3 LOW}$.

## UI Layout
- Route: `/security`
- Top Header: SecOps Incident Triage & CVE Cross-Domain Correlation
- Metric Ribbon: P0 Threats Active, Compromised Accounts Intercepted, Downstream Blast Radius Nodes, MTTR Reduction
- Split Panel:
  - Left: Interactive Cytoscape Graph showing CVE -> Service -> Credential -> Account
  - Right: Finding Priority Breakdown, Blast Radius Tree, and Remediation Actions ("Revoke Compromised Credentials", "Freeze Compromised Accounts", "Page Owning Team")
