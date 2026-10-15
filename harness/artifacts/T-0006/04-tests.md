---
status: complete
owner: test-author
task: T-0006
inputs: ["harness/artifacts/T-0006/01-spec.md", "harness/artifacts/T-0006/03-plan.md"]
acceptance_refs: ["AC-007-a", "AC-007-b", "AC-007-c", "AC-007-d"]
---

# 04-tests: Tests for Agent Loop & Streaming Chat Route

## Automated Test Results (bun test tests/unit/test-agent.test.js tests/unit/test-chat-route.test.js)

```
tests/unit/test-agent.test.js:
(pass) Agent Loop & Orchestration Tests > exports a comprehensive system prompt enforcing Rule F4 and Skeptic challenges
(pass) Agent Loop & Orchestration Tests > creates AI SDK compliant tool definitions
(pass) Agent Loop & Orchestration Tests > investigates Ring A suspect account and arrives at FREEZE decision
(pass) Agent Loop & Orchestration Tests > investigates Ring B benign family account and clears via Skeptic challenge

tests/unit/test-chat-route.test.js:
(pass) Chat Route (/api/chat) Tests > responds to GET with agent status and model metadata
(pass) Chat Route (/api/chat) Tests > handles investigation request via POST without external API key
(pass) Chat Route (/api/chat) Tests > returns 400 on invalid JSON body

7 pass, 0 fail (100% green)
```
