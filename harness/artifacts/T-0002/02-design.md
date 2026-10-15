---
status: complete
owner: designer
task: T-0002
inputs: ["01-spec.md"]
acceptance_refs: ["AC-002-schema", "AC-002-client", "AC-002-ro", "AC-002-unit"]
---

# 02-design: FalkorDB Schema Models & Client Interface

## Entity Schema Design
- Customer: `id`, `name`, `email`, `riskScore`
- Account: `id`, `flagged` (bool), `frozen` (bool), `createdAt`
- Device: `id`, `known_bad` (bool), `fingerprint`
- IPAddress: `id`, `ip`, `isProxy` (bool)
- Card: `id`, `last4`, `expMonth`, `expYear`
- Address: `id`, `street`, `city`, `zip`
- Transaction: `id`, `amount` (number), `ts` (string/number), `flagged` (bool)
- Merchant: `id`, `name`, `category`
- Rule: `id`, `name`, `severity`

## Relationships
- `OWNS`, `USES`, `LOGGED_IN_FROM`, `HAS_CARD`, `LIVES_AT`, `PAID_TO`, `FROM`, `TO`, `FLAGGED_BY`
- `DEPENDS_ON`, `USES_PACKAGE`, `AFFECTED_BY`, `EXPOSED_VIA`, `READS_FROM`, `GRANTS_ACCESS_TO`, `USED_BY`
