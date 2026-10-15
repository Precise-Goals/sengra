---
status: complete
owner: scribe
task: T-0013
inputs: ["harness/artifacts/T-0013/07-qa.md"]
acceptance_refs: ["AC-014-a", "AC-014-b", "AC-014-c", "AC-014-d"]
---

# 08-docs: Documentation for Security Bonus Layer

## Summary of Changes
- Package `@sengra/schema`:
  - Added `ServiceSchema`, `CVESchema`, `CredentialSchema`, `PackageSchema`, `DatastoreSchema`, `BlastRadiusSchema`, and `FindingPrioritySchema` in `packages/schema/src/security.js`.
- Package `@sengra/tools`:
  - Implemented `cveToFraudLinks`, `calculateBlastRadius`, `evaluateFindingPriority`, and `whoKnowsSystem` in `packages/tools/src/security.js`.
  - Registered 4 security tools in `TOOL_CATALOG` and `TOOL_HANDLERS`.
- Next.js Web App:
  - Created interactive Security Operations Console at `apps/web/src/app/security/page.jsx`.
  - Added header links across `/`, `/compare`, and `/security`.
- Test Suite:
  - Added `tests/unit/test-security.test.js` validating schema, bridge queries, blast radius, and finding priority.

## Verification
- `bun test tests/unit` (66 passed)
- `pnpm turbo run build`
- `python scripts/check_harness.py; pytest tests/harness`
