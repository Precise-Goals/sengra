# SENGRA — Cypher Query Cookbook & Graph Patterns

> Canonical Cypher queries for financial fraud investigation and cross-domain cybersecurity correlation in FalkorDB.

---

## 1. Safety & Parameterization Standards

All queries in SENGRA must use explicit `$param` bindings and run through `assertReadOnlyCypher`:
* Zero string concatenation in query bodies.
* Maximum row limit constraint ($\le 1,000$ rows).
* Disallowed mutations (`CREATE`, `MERGE`, `SET`, `DELETE`, `DROP`).
* Use `GRAPH.RO_QUERY` (`roQueryGraph`) for non-mutating analytic operations.

---

## 2. Fraud Core Queries

### 2.1 Trace Shared Devices Between Accounts
Finds accounts sharing hardware with a suspect account:
```cypher
MATCH (a:Account {id: $accountId})-[:USES]->(d:Device)<-[:USES]-(linked:Account)
WHERE a <> linked
RETURN linked.id AS linkedAccountId, d.id AS sharedDeviceId, d.known_bad AS isBadDevice
LIMIT 50
```

### 2.2 Multi-Hop Distance to Known-Bad Devices (Rule F4 Gate)
Calculates topological shortest path to any confirmed bad device:
```cypher
MATCH path = shortestPath((a:Account {id: $accountId})-[:USES|TRANSFERRED_TO*1..3]-(d:Device {known_bad: true}))
RETURN length(path) AS hopsToBadDevice, [n IN nodes(path) | n.id] AS evidencePath
LIMIT 1
```

### 2.3 Detect Circular Payment Layering (Mule Structuring)
Identifies cyclical fund movements characteristic of money laundering:
```cypher
MATCH path = (a:Account {id: $accountId})-[:TRANSFERRED_TO*2..4]->(a:Account {id: $accountId})
RETURN [n IN nodes(path) | n.id] AS circularPath, length(path) AS cycleLength
LIMIT 10
```

### 2.4 Weakly Connected Components (WCC Ring Identification)
Clusters accounts and shared devices into connected fraud rings:
```cypher
CALL algo.WCC({
  nodeLabels: ['Account', 'Device'],
  relationshipTypes: ['USES', 'TRANSFERRED_TO']
})
YIELD node, componentId
RETURN componentId, count(node) AS componentSize
ORDER BY componentSize DESC
LIMIT 20
```

---

## 3. Benign Cluster Validation (Skeptic Challenge)

Verifies legitimate household sharing residential network origins:
```cypher
MATCH (a:Account {id: $accountId})-[:LIVES_AT]->(addr:Address)<-[:LIVES_AT]-(family:Account)
OPTIONAL MATCH (family)-[:USES]->(bad:Device {known_bad: true})
RETURN addr.id AS sharedAddress, count(DISTINCT family) AS familyMembersCount, count(bad) AS badDeviceCount
```

---

## 4. Security Bonus Layer: Cross-Domain Correlation

### 4.1 Upstream CVE to Compromised Financial Accounts Bridge
Traces from an affected package vulnerability all the way to compromised customer accounts:
```cypher
MATCH (cve:CVE {id: $cveId})<-[:AFFECTED_BY]-(pkg:Package)<-[:USES_PACKAGE]-(svc:Service)
MATCH (cred:Credential)-[:GRANTS_ACCESS_TO]->(svc)
MATCH (cred)-[:USED_BY]->(acc:Account)
RETURN cve.id AS cve,
       svc.id AS vulnerableService,
       cred.id AS leakedCredential,
       collect(acc.id) AS compromisedAccounts
```

### 4.2 Downstream Service Blast Radius
Computes downstream microservices and datastores reachable from a compromised component:
```cypher
MATCH path = (svc:Service {id: $serviceId})-[:DEPENDS_ON*1..3]->(downstream:Service)
OPTIONAL MATCH (downstream)-[:READS_FROM]->(db:Datastore)
RETURN collect(DISTINCT downstream.id) AS downstreamServices,
       collect(DISTINCT db.id) AS affectedDatastores
```

---

## 5. FalkorDB Protocol & Command Model

FalkorDB is a high-performance graph database built on the Redis protocol (default port 6379), executing OpenCypher queries via native Redis commands:

| Command | Driver Method | Description & Usage |
|---|---|---|
| `GRAPH.QUERY` | `graph.query(cypher, { params })` | Executes read-write queries (e.g. seeding nodes, persisting memory decisions). |
| `GRAPH.RO_QUERY` | `graph.roQuery(cypher, { params })` | Executes strictly read-only queries with engine-level write rejection; routed to read replicas. |
| `GRAPH.EXPLAIN` | `graph.explain(cypher)` | Returns the query execution plan without running it. |
| `GRAPH.CONFIG SET` | `client.configSet(...)` | Configures engine runtime parameters dynamically. |

> **Important**: FalkorDB is the modern successor to RedisGraph (which reached end-of-life on January 31, 2025). FalkorDB does not use Bolt or SQL drivers; always use the official `falkordb` npm/pip client.

---

## 6. Official FalkorDB MCP Server Configuration

AI agents and developer tooling connect to FalkorDB via the official `@falkordb/mcpserver` package.

### Configuration Template (`.agents/mcp_config.json`):
```json
{
  "mcpServers": {
    "falkordb": {
      "command": "npx",
      "args": ["-y", "@falkordb/mcpserver@latest"],
      "env": {
        "FALKORDB_HOST": "localhost",
        "FALKORDB_PORT": "6379",
        "FALKORDB_DEFAULT_READONLY": "false"
      }
    },
    "falkordb-readonly": {
      "command": "npx",
      "args": ["-y", "@falkordb/mcpserver@latest"],
      "env": {
        "FALKORDB_HOST": "localhost",
        "FALKORDB_PORT": "6379",
        "FALKORDB_DEFAULT_READONLY": "true"
      }
    }
  }
}
```

### Environment Variables Reference:
* `FALKORDB_HOST`: Hostname of the FalkorDB instance (default: `localhost`).
* `FALKORDB_PORT`: TCP port (default: `6379`).
* `FALKORDB_PASSWORD`: Auth credential for protected/cloud instances.
* `FALKORDB_DEFAULT_READONLY`: Set to `'true'` to enforce read-only execution on replica nodes.
* `MCP_TRANSPORT`: `'stdio'` (for local IDEs like Antigravity / Claude Desktop) or `'http'` (for remote access).
* `MCP_PORT`: HTTP transport listener port (default: `3000`).
* `MCP_API_KEY`: Bearer token for securing HTTP transport.
