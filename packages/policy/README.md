# @sengra/policy

Pure deterministic fraud policy engine and Skeptic verification rules for SENGRA.

## Capabilities
- **Pure Logic**: Zero network, file system, or database dependencies. 100% deterministic and unit-tested in isolation.
- **Rule F4 Enforcement**: Account freeze decisions require strict graph conditions:
  - Connects to a component with $\ge 3$ flagged accounts.
  - Within $\le 2$ hops of a confirmed bad device (`known_bad: true`).
  - No prior clearance recorded in cross-session memory.
  - Fails the Skeptic challenge.
- **Skeptic Challenge**: Proactively tests for benign explanations (e.g., family members sharing address and home Wi-Fi with no bad devices or circular transfers) before irreversible actions are taken.
- **Explainability**: Returns structured evidence paths, confidence scores, and machine-readable reason codes.

## API
```javascript
import { evaluateFreezePolicy, skepticCheck, DECISION_ACTIONS } from "@sengra/policy";

const decision = evaluateFreezePolicy({
  accountId: "ACC_001",
  flaggedInComponent: 4,
  hopsToBadDevice: 1,
  crossCheckPassed: true,
});
// decision.decision === DECISION_ACTIONS.FREEZE
```
