---
status: complete
owner: test-author
task: T-0013
inputs: ["harness/artifacts/T-0013/03-plan.md"]
acceptance_refs: ["AC-014-a", "AC-014-b", "AC-014-c", "AC-014-d"]
---

# 04-tests: Test Suite for Security Bonus Layer & Bridge Query

## Test Cases
1. `validates security Zod schemas correctly`: Ensures `ServiceSchema`, `CVESchema`, and `CredentialSchema` parse and validate data.
2. `traces CVE-to-fraud bridge query connecting vulnerability to compromised accounts`: Verifies `cveToFraudLinks` joins CVE-2024-3094 with target compromised accounts `A-TAKEOVER-1` through `4`.
3. `calculates downstream service blast radius accurately`: Verifies `calculateBlastRadius` traces dependent services (`SVC-PAYMENT-CORE`) and sensitive databases (`DB-USER-CREDENTIALS`).
4. `prioritizes vulnerabilities with fraud linkage as P0 Critical`: Asserts fraud-linked findings receive P0 priority and $>85$ score.
5. `resolves owning team and on-call engineer contacts`: Asserts `whoKnowsSystem` provides accurate incident contact routing.

## Red Run Evidence
- Command: `bun test tests/unit/test-security.test.js`
- Exit Code: `1`
- Output:
```
error: Cannot find module '../../packages/schema/src/security.js' from 'D:\Workspace\Projects\sengra\tests\unit\test-security.test.js'
 0 pass
 1 fail
 1 error
```
