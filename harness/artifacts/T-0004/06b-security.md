---
status: complete
owner: security
task: T-0004
inputs: ["harness/artifacts/T-0004/05-build.md"]
acceptance_refs: ["AC-003-a", "AC-003-b", "AC-005-a", "AC-005-b", "AC-008-a"]
---

# 06b-security: Analysis & Policy Security Audit

## Security Audit
- Deterministic Guardrails: Zero LLM hallucinations can directly trigger account freezes. Freeze operations require hard-coded graph topology criteria (>= 3 flagged accounts, <= 2 hops to bad device).
- Pure Logic Isolation: Policy and analysis packages are pure functions with zero network, file system, or database access, preventing SSRF or remote code execution.
- Skeptic Verification: Built-in skeptic rules proactively check for benign family cluster explanations to protect legitimate users from false positives.
- Input Hardening: Default arguments, defensive node/edge checks, and type-coercion guards prevent prototype pollution or unhandled null reference exceptions.
- Verdict: PASS.
