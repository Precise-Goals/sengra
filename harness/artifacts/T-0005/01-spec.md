---
status: complete
owner: po-spec
task: T-0005
inputs: ["harness/tasks/T-0005.md", "docs/harness.md"]
acceptance_refs: ["AC-006-a", "AC-006-b", "AC-006-c", "AC-006-d"]
---

# 01-spec: MCP Tool Catalog & Handler

## Problem Statement
The LLM agent requires a structured, safe, and observable interface to interact with FalkorDB, run Graphology topological analysis, check fraud policies, test skeptic challenges, and take auditable actions. MCP (Model Context Protocol) provides the standard protocol for tool discovery and invocation.

## Scope
- Define 11 fraud tools with JSON Schema signatures.
- Implement execution handlers for each tool with strict Zod validation.
- Implement read-only Cypher query security filter rejecting write operations.
- Implement JSON-RPC 2.0 route handler at `/api/mcp`.
