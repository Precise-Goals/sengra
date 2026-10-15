---
status: complete
owner: tech-lead
task: T-0013
inputs: ["harness/artifacts/T-0013/01-spec.md", "harness/artifacts/T-0013/02-design.md"]
acceptance_refs: ["AC-014-a", "AC-014-b", "AC-014-c", "AC-014-d"]
---

# 03-plan: Implementation Plan for Security Bonus Layer

## Lane Allocation
- Lane: `security-bonus`
- Owned paths:
  - `packages/schema/src/security.js`
  - `packages/schema/src/index.js`
  - `packages/tools/src/security.js`
  - `packages/tools/src/index.js`
  - `apps/web/src/app/security/page.jsx`
  - `tests/unit/test-security.test.js`

## Steps
1. Author red unit test suite in `tests/unit/test-security.test.js` validating schema validation, bridge query logic, finding priority calculation, and blast radius.
2. Establish lane lock in `harness/state/locks/security-bonus.json`.
3. Implement `packages/schema/src/security.js` with Zod schemas and re-export in `packages/schema/src/index.js`.
4. Implement `packages/tools/src/security.js` with `cve_to_fraud_links`, `blast_radius`, `evaluate_finding_priority`, `who_knows_system` and register in `packages/tools/src/index.js`.
5. Implement interactive Security Operations Console at `apps/web/src/app/security/page.jsx`.
6. Run unit tests, harness checks, and Next.js build.
