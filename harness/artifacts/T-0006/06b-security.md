---
status: complete
owner: security
task: T-0006
inputs: ["harness/artifacts/T-0006/05-build.md"]
acceptance_refs: ["AC-007-a", "AC-007-b", "AC-007-c", "AC-007-d"]
---

# 06b-security: Agent Loop Security Audit

## Security Audit
- Hard Policy Enforcement: Account freezing cannot be commanded directly by raw LLM generation; it is mediated strictly through `evaluateFreezePolicy` which validates graph topological constraints.
- Sensitive Input Sanitization: Target IDs are cleansed against regex `/[^A-Za-z0-9_-]/g` before graph queries to prevent injection.
- Secret Hygiene: `ANTHROPIC_API_KEY` is accessed only from server-side environment variables and is never exposed to the client bundle or included in error traces.
- Timeout / Infinite Loop Mitigation: AI SDK `maxSteps` is capped at 10 to prevent runaway loops or budget exhaustion.
- Verdict: PASS.
