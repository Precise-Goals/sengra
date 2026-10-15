# SENGRA — API & MCP Tool Protocols Reference

> Specification of Next.js Route Handlers and Model Context Protocol (MCP) Streamable HTTP Tools

---

## 1. Overview of Endpoints

| Route | Method | Description |
|---|---|---|
| `/api/chat` | `GET` | System health check and model metadata |
| `/api/chat` | `POST` | Autonomous multi-step fraud investigation agent stream |
| `/api/mcp` | `GET` | MCP server health, protocol version, and tool count |
| `/api/mcp` | `POST` | Streamable HTTP JSON-RPC 2.0 tool discovery (`tools/list`) and invocation (`tools/call`) |

---

## 2. Agent Chat API (`/api/chat`)

### Investigation Request (`POST /api/chat`)
Executes an autonomous investigation over a suspect account.

```json
{
  "accountId": "A-RINGA-1",
  "context": {
    "flaggedInComponent": 8,
    "hopsToBadDevice": 1,
    "badDevices": ["D-17"],
    "hasCircularPayments": true
  }
}
```

### Response Payload
```json
{
  "success": true,
  "data": {
    "accountId": "A-RINGA-1",
    "decision": "FREEZE",
    "confidence": 0.95,
    "actionTaken": "ACCOUNT_FROZEN",
    "skepticCleared": false,
    "evidencePath": ["A-RINGA-1", "D-17", "A-RINGA-COLLECTOR"],
    "explanation": "Account A-RINGA-1 is part of a 8-account flagged component and within 1 hop(s) of known-bad device. Gated freeze approved."
  }
}
```

---

## 3. Model Context Protocol (`/api/mcp`)

The MCP server implements the JSON-RPC 2.0 protocol over HTTP.

### Discover Tools (`tools/list`)
```json
{
  "jsonrpc": "2.0",
  "id": "req-1",
  "method": "tools/list"
}
```

### Call Tool (`tools/call`)
Example invoking the deterministic policy evaluation tool:

```json
{
  "jsonrpc": "2.0",
  "id": "req-2",
  "method": "tools/call",
  "params": {
    "name": "evaluate_freeze_policy",
    "arguments": {
      "accountId": "A-RINGA-1",
      "flaggedInComponent": 8,
      "hopsToBadDevice": 1,
      "crossCheckPassed": true
    }
  }
}
```

### Tool Response
```json
{
  "jsonrpc": "2.0",
  "id": "req-2",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"decision\":\"FREEZE\",\"confidence\":0.95,\"explanation\":\"Account A-RINGA-1 is part of a 8-account flagged component and within 1 hop(s) of known-bad device. Gated freeze approved.\"}"
      }
    ],
    "isError": false
  }
}
```

---

## 4. Complete Tool Catalog Reference

### 1. `recall_entity`
* **Input**: `{ id: string, type?: string, hops?: number }`
* **Description**: Recalls 1-hop or 2-hop topological neighborhood for an entity.

### 2. `detect_communities`
* **Input**: `{ componentId?: string, algorithm?: "louvain" | "wcc" }`
* **Description**: Partitions suspect graph into discrete community clusters.

### 3. `analyze_subgraph`
* **Input**: `{ nodes: object[], edges: object[], componentId?: string }`
* **Description**: In-process Graphology topological analytics (Louvain, betweenness centrality, bridge detection).

### 4. `shortest_path`
* **Input**: `{ a: string, b: string, maxHops?: number }`
* **Description**: Calculates shortest graph traversal path between two accounts.

### 5. `skeptic_challenge`
* **Input**: `{ accountId: string, hasSharedAddress?: boolean, hasSharedIp?: boolean, badDevices?: string[] }`
* **Description**: Evaluates legitimate household hypotheses to prevent false positive freezes.

### 6. `evaluate_freeze_policy`
* **Input**: `{ accountId: string, flaggedInComponent?: number, hopsToBadDevice?: number }`
* **Description**: Evaluates deterministic Rule F4 gating criteria.

### 7. `freeze_account`
* **Input**: `{ accountId: string, reason?: string, decisionId?: string }`
* **Description**: Executes account freeze action and creates audit log.

### 8. `open_case`
* **Input**: `{ target: string, title?: string, severity?: string }`
* **Description**: Creates formal investigation record in `agent_memory`.

### 9. `notify`
* **Input**: `{ target: string, severity?: string, message?: string }`
* **Description**: Dispatches security notification to security analysts.

### 10. `record_decision`
* **Input**: `{ decision: string, target: string, confidence: number, explanation: string, evidencePath: string[] }`
* **Description**: Appends immutable decision to `decisions` audit graph.

### 11. `run_cypher_readonly`
* **Input**: `{ query: string, params?: object, limit?: number }`
* **Description**: Executes guarded read-only Cypher with parameterization checks.

### 12. `cve_to_fraud_links`
* **Input**: `{ cveId?: string, serviceId?: string }`
* **Description**: Traverses cross-domain bridge from CVE to compromised customer accounts.

### 13. `blast_radius`
* **Input**: `{ serviceId?: string }`
* **Description**: Calculates downstream service dependencies and affected sensitive datastores.

### 14. `evaluate_finding_priority`
* **Input**: `{ cveId: string, cvss: number, isInternetExposed?: boolean, hasCustomerPII?: boolean, isFraudLinked?: boolean }`
* **Description**: Calculates composite vulnerability priority score factoring in fraud risk.

### 15. `who_knows_system`
* **Input**: `{ serviceId?: string }`
* **Description**: Resolves owning engineering team and on-call responders for incident paging.
