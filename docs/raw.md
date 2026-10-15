# SENGRA: A Graph-Native Fraud Agent (with a Security Bonus Layer)

> Hackathon track: **Agents that act on connected data** (touches Agent Memory and Company Brain)
> Context layer: **FalkorDB** | Tool protocol: **MCP** | Agent: **Claude via Vercel AI SDK**
> Team: **Solo** | Language: **JavaScript (ES modules) end to end** | Repo: **Turborepo monorepo** | Hosting: **Vercel + FalkorDB Cloud (managed)**

---

## 0. Decisions locked in

| Decision | Choice |
|---|---|
| Team size | Solo, so scope is cut hard and ordered by priority (Section 17) |
| Headline domain | **Fraud ring investigation** (must work end to end first) |
| Bonus layer | **Security triage + CVE-to-fraud bridge**, built only after fraud is done |
| Frontend | **React (Next.js) with a polished graph visualization**; UI polish is a real goal |
| Backend | **Vercel** (Next.js route handlers as serverless/Fluid functions) |
| Language | **Plain JavaScript (ES modules), no TypeScript for now.** Editor hints via JSDoc, runtime safety via Zod. Every "Python SDK" in the original brief is replaced by its JS equivalent |
| Graph database | **FalkorDB Cloud (managed). No self-hosting, no Docker** |
| Graph visualization | **Cytoscape.js** (final choice) |
| In-app graph analysis | **graphology** (the JS equivalent of Python's NetworkX), since NetworkX itself is Python-only |
| Repo tooling | **Turborepo + pnpm workspaces**, shared packages, official SDKs |
| Multi-agent mode | Stretch goal only; dropped if behind schedule |

---

## 1. One-line pitch

An agent that finds fraud rings by **following relationships in a FalkorDB graph**, decides and acts only when the graph supports it, remembers what it learned across sessions, and shows the exact graph path behind every decision in a live, animated visualization. A bonus layer links vulnerable services to the fraud they enable.

---

## 2. Problem statement

### 2.1 What goes wrong today
Fraud analysts (and the agents that assist them) see **pieces, not the whole picture.**

| Pain | Example |
|---|---|
| Signal lives in connections | One flagged $400 transfer looks harmless; ten accounts sharing one device and one payout loop is a ring |
| No memory | The same device is re-investigated every week by a new analyst or a fresh agent session |
| No explanation | "Model score 0.91" with no reason a human can verify |
| False positives | A family sharing a Wi-Fi network and address gets frozen as a "ring" |
| Silos with security | Leaked credentials from a vulnerable service never get linked to the fraud they enable |

### 2.2 Bonus insight: fraud and security chain together
```
Vulnerable service --leaks--> Credentials --used by--> Account takeover --pays--> Mule accounts
     (security)                                            (fraud)
```
In a single graph one traversal answers: *"Which unpatched service is enabling live fraud?"* No isolated tool can.

### 2.3 What we build
An agent that:
1. **Follows connections** across fraud data (multi-hop).
2. **Decides from graph results** (algorithms as tools), not LLM guesswork.
3. **Acts** (freeze, open case, notify) only when graph evidence meets policy, and correctly **declines** when it does not.
4. **Remembers** prior cases and clearances across sessions.
5. **Explains** every action with an evidence path, plain English, and a highlighted subgraph.

---

## 3. Users and example questions

| Persona | Question |
|---|---|
| Fraud analyst | "Which accounts are linked to this flagged transaction?" |
| Fraud analyst | "Is this account a ring member or an innocent neighbor?" |
| Risk manager | "Show me the evidence for why account A-482 was frozen." |
| Security engineer (bonus) | "Which vulnerable service is enabling live fraud?" |
| SecOps lead (bonus) | "Which findings matter most this week, and who owns them?" |

---

## 4. Features (priority ordered)

### P0: Must ship (fraud core)
**F1. Multi-hop investigation.** Expand around any entity (account, device, IP, card, address). Find linked accounts from one transaction across shared devices, cards, addresses and payment flows. Hop depth is a tool parameter.

**F2. Graph algorithms as tools.**
| Algorithm | Use |
|---|---|
| Weakly connected components (WCC) | Detect rings and clusters |
| PageRank | Find the central accounts (collector mule, ring leader) |
| Betweenness / centrality | Find the shared "bridge" device or account |
| Shortest path | Answer "why are these two connected?" |
| Label propagation (community detection, in FalkorDB) | Split a large component into sub-groups |
| Louvain communities + betweenness (graphology) | Deep analysis of a suspect subgraph; find bridge accounts |

**F3. Tool selection through MCP.** All tools served from an MCP server; the agent discovers them at runtime and picks per question. A trace panel proves different questions use different tools.

**F4. Graph-gated actions.** Actions are policy functions over graph results.
- **Freeze** if: account is in a component with >= 3 flagged accounts AND within 2 hops of a known-bad device AND not previously cleared.
- **Hold for human** if evidence is partial.
- **No action** if the Skeptic finds a benign explanation (family cluster).

**F5. Cross-session memory.** Runs, cases, clearances and learned patterns are written to an `agent_memory` graph. Every session starts with a memory recall. Demo: run 2 is faster and cites run 1.

**F6. Explainable results.** Every decision stores an evidence path as edges, returns the Cypher, a plain-English sentence, and drives a highlighted visualization.

**F7. Skeptic check.** Before acting, try to clear the account (shared household, legitimate family devices, merchant hubs), using memory of past clearances.

### P1: Should ship
**F8. Baseline comparison.** Same alerts, two agents: flat-table agent (no graph tools) vs graph agent. Side-by-side tab with metrics.

**F9. Polished UI.** Animated path highlighting, streaming tool trace, case report card (Section 13).

### P2: Bonus (only after P0 and P1 work)
**F10. Security layer.** Service, package, CVE, exposure and datastore nodes; blast radius; finding priority; **CVE -> credential -> account -> fraud** bridge query.

### P3: Stretch
**F11. Multi-agent split.** Investigator (reads), Skeptic (challenges), Actioner (acts), sharing state through the graph.

---

## 5. Architecture

### 5.1 System diagram
```
          Browser (React / Next.js UI)
   chat + tool trace + graph canvas + case card
                    |  streaming (AI SDK useChat)
                    v
      Vercel: /api/chat  (agent loop, streamText + Claude)
                    |  MCP client (Streamable HTTP)
                    v
      Vercel: /api/mcp  (MCP server: tools)
        |-- query tools      (Cypher)
        |-- algo tools       (WCC, PageRank, paths)
        |-- analysis tools   (graphology: Louvain, betweenness)
        |-- policy tools     (gates, skeptic)
        |-- action tools     (freeze, open case, notify)
        |-- memory tools     (recall, record)
                    |  falkordb (Node client, TLS)
                    v
      FalkorDB Cloud (managed, TLS)
        graph: domain | graph: agent_memory | graph: decisions
```

### 5.2 Hosting: FalkorDB Cloud
**FalkorDB cannot run on Vercel.** Vercel functions are stateless and short-lived; a graph database is stateful. Sengra uses **FalkorDB Cloud (managed)** for every environment, so there is no Docker, no VPS, and nothing to patch or back up.
- Vercel hosts only the Next.js app (UI + `/api/chat` + `/api/mcp`).
- The functions connect to FalkorDB Cloud over **TLS** with host, port, username and password from the cloud console.
- **One cloud instance, separate graph names per environment** (e.g. `dev_domain`, `prod_domain`, `prod_agent_memory`, `prod_decisions`) so local development and the deployed demo never overwrite each other.
- Use the FalkorDB Cloud console/Browser to inspect the data model and run queries while building (check what your plan includes).
- Keep the Vercel function region close to the FalkorDB Cloud region to minimize per-query latency.

### 5.3 Three graphs in one instance
| Graph | Purpose | Lifetime |
|---|---|---|
| `domain` | Accounts, devices, cards, addresses, transactions (and security nodes in the bonus layer) | Reseeded as needed |
| `agent_memory` | Runs, cases, cleared and flagged entities, learned patterns | Persistent |
| `decisions` | Decisions, evidence paths, actions: the audit trail | Append-only |

Selected in code with `db.selectGraph("domain")`, etc.

### 5.4 Agent loop (per alert)
1. **Recall** from `agent_memory` for the entities involved.
2. **Plan**: model chooses tools discovered via MCP.
3. **Investigate**: traversals and algorithms return subgraphs.
4. **Challenge**: Skeptic tool tries to clear.
5. **Gate**: policy tool checks graph evidence against rules.
6. **Act or hold**: execute the action or route to human.
7. **Record**: write decision, evidence path and learned facts to graph.
8. **Explain**: stream sentence + path + subgraph to the UI.

### 5.5 Streaming and serverless constraints
- Use `streamText` and stream tool calls and results so the UI shows live steps.
- Set `export const maxDuration = 60` (or higher on Fluid compute) on `/api/chat`.
- Cache the FalkorDB client on `globalThis` so warm invocations reuse the connection.
- Keep each tool fast; the graph is small (a few thousand nodes) so queries return in milliseconds.
- MCP route is stateless (no session storage needed for this tool set).

### 5.6 Two compute paths for graph algorithms (FalkorDB + graphology)
Sengra deliberately uses both, and says which one produced each answer.

| Path | Where it runs | Used for |
|---|---|---|
| **In-database** | FalkorDB Cloud (`algo.WCC`, `algo.pageRank`, `algo.BFS`, shortest paths) | Whole-graph questions: find all rings, rank all accounts |
| **In-process (graphology)** | Inside the Vercel function, on a **subgraph pulled from FalkorDB** | Deep analysis of one suspect cluster: Louvain communities, betweenness, density, bridge nodes, cross-checks |

Flow: FalkorDB narrows millions of possible edges to a small suspect subgraph (fast, in the DB) -> `packages/analysis` loads it into a graphology graph -> runs NetworkX-style analysis -> results feed the policy gate and the UI.

```js
import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import betweenness from "graphology-metrics/centrality/betweenness";
import { connectedComponents } from "graphology-components";

/** @param {{id: string}[]} nodes  @param {{source: string, target: string}[]} edges */
export function analyzeSubgraph(nodes, edges) {
  const g = new Graph({ type: "undirected", multi: false });
  nodes.forEach(n => g.addNode(n.id, n));
  edges.forEach(e => !g.hasEdge(e.source, e.target) && g.addEdge(e.source, e.target, e));
  return {
    communities: louvain(g),                 // node -> community id
    betweenness: betweenness(g),             // node -> score (bridge nodes)
    components: connectedComponents(g),      // cross-check vs algo.WCC
    density: (2 * g.size) / (g.order * (g.order - 1) || 1),
  };
}
```
**Cross-check as an explainability feature:** the ring found by FalkorDB's WCC is re-verified with graphology's connected components; a mismatch lowers confidence and routes to HOLD.

> If you later want real NetworkX, Vercel supports Python functions and one could be added as a sidecar. It is out of scope here to keep one language and one deploy.

---

## 6. Tech stack (all JavaScript)

### 6.1 "Python SDK -> JS SDK" mapping
| Original (Python) | Used here (JS) |
|---|---|
| `falkordb` Python client | **`falkordb`** npm package (official Node.js client) |
| MCP Python SDK | **`@modelcontextprotocol/sdk`** (official JS SDK) with Vercel's **`mcp-handler`** adapter for Next.js |
| Anthropic Python SDK | **Vercel AI SDK** (`ai`, `@ai-sdk/anthropic`); optionally `@anthropic-ai/sdk` |
| FastAPI backend | **Next.js route handlers** on Vercel |
| Streamlit UI | **React + Next.js + Tailwind + shadcn/ui** |
| Faker / pandas seed scripts | **`@faker-js/faker`** + seeded RNG, run with `node` |
| NetworkX | **graphology** + `graphology-communities-louvain`, `graphology-metrics`, `graphology-components`, `graphology-shortest-path` |
| pytest | **Vitest** |
| Pydantic | **Zod** |

> Package names and AI SDK / MCP helper APIs change between versions. Pin versions in the lockfile and check the current docs when installing.

### 6.2 Full stack
| Layer | Choice |
|---|---|
| Monorepo | **Turborepo** + **pnpm** workspaces |
| Language | JavaScript (ES modules), JSDoc for editor types, Zod for runtime validation |
| Frontend | Next.js (App Router), React, Tailwind CSS, shadcn/ui, Framer Motion |
| Graph viz | **Cytoscape.js** (final choice; path highlighting, layouts) via `react-cytoscapejs` |
| Agent | Vercel AI SDK + Claude (tool use, streaming) |
| Tool server | MCP JS SDK + `mcp-handler`, tools defined with Zod schemas |
| Graph DB | **FalkorDB Cloud** + `falkordb` Node client |
| Graph analysis | **graphology** (NetworkX equivalent) |
| Validation | Zod (shared between tools, API and UI) |
| Testing | Vitest (tools without an LLM), Playwright (optional UI smoke test) |
| Lint/format | ESLint + Prettier (shared config package) |
| CI | GitHub Actions running `turbo run lint test build` |
| Hosting | Vercel (web) + FalkorDB Cloud (db) |

### 6.3 FalkorDB client usage (shape)
```js
import { FalkorDB } from "falkordb";

const g = globalThis;
export const getDb = () =>
  (g._falkor ??= FalkorDB.connect({
    username: process.env.FALKORDB_USERNAME,
    password: process.env.FALKORDB_PASSWORD,
    socket: {
      host: process.env.FALKORDB_HOST,
      port: Number(process.env.FALKORDB_PORT ?? 6379),
      tls: process.env.FALKORDB_TLS === "true",
    },
  }));

export async function domain() {
  return (await getDb()).selectGraph("domain");
}

// parameterised query
const res = await (await domain()).query(
  "MATCH (a:Account {id:$id})-[:USES]->(d:Device)<-[:USES]-(b:Account) RETURN b.id, d.id",
  { params: { id } }
);
```
**FalkorDB Cloud connection:** copy host, port, username and password from the cloud console into Vercel env vars; set `FALKORDB_TLS=true`. Reuse one cached client per function instance.

**Read-only guard:** the fallback `run_cypher_readonly` tool uses the client's read-only query method (`roQuery`), so the database itself rejects writes, in addition to an allow-list check.

---

## 7. Monorepo layout (Turborepo)

```
sengra/
  package.json              # pnpm workspace root, scripts delegate to turbo
  pnpm-workspace.yaml
  turbo.json                # pipeline: build, dev, lint, test, seed
  .env.example
  README.md
  apps/
    web/                    # Next.js app (Vercel project root)
      app/
        page.jsx            # main investigation UI
        compare/page.jsx    # baseline vs graph
        memory/page.jsx     # memory explorer
        api/
          chat/route.js     # agent loop (streamText + MCP client)
          mcp/[transport]/route.js   # MCP server (mcp-handler)
          graph/route.js    # subgraph fetch for UI
          eval/route.js     # baseline vs graph run
      components/           # chat, tool trace, graph canvas, case card
  packages/
    graph/                  # falkordb client, graph selection, helpers, query builders
    schema/                 # Zod schemas (+ JSDoc typedefs) for nodes, edges, tool I/O
    tools/                  # tool implementations (query, algo, policy, action, memory)
    policy/                 # freeze policy, skeptic rules, finding priority (pure functions, unit-tested)
    memory/                 # recall/record against agent_memory and decisions graphs
    analysis/               # graphology: load subgraph, Louvain, betweenness, WCC cross-check
    data/                   # seeded synthetic generator + ground truth + seed CLI
    agent/                  # prompts, agent config, baseline agent
    ui/                     # shared React components (design system on shadcn)
    eval/                   # metrics runner (precision/recall, tool-call counts)
    config/                 # shared tsconfig, eslint, prettier
```

### 7.1 Why this structure
- `tools` is **imported by both** the MCP route and the baseline/eval code, so there is one source of truth.
- `policy` is pure functions, so freeze logic is unit-tested without a database or LLM.
- `schema` (Zod) is shared by tools, API and UI, so shapes never drift.
- `turbo.json` caches builds and tests; `turbo run dev --filter=web` for daily work.

### 7.2 Vercel setup
- Import the repo, set **Root Directory = `apps/web`**; enable "include files outside root directory" so workspace packages resolve.
- Install command: `pnpm install`; build: `pnpm turbo run build --filter=web`.
- Environment variables: `ANTHROPIC_API_KEY`, `FALKORDB_HOST`, `FALKORDB_PORT`, `FALKORDB_USERNAME`, `FALKORDB_PASSWORD`, `FALKORDB_TLS`, `MCP_SHARED_SECRET` (protects the MCP route).
- Add `FALKORDB_GRAPH_PREFIX` (`dev_` locally, `prod_` on Vercel) so environments share one cloud instance safely.
- Optional: `turbo-ignore` to skip builds when `apps/web` and its deps did not change.

### 7.3 Next.js scaffold (`apps/web`) and recommended answers

Run `create-next-app` inside `apps/web` (or create it with `pnpm create next-app apps/web`) and answer the prompts like this:

| Prompt | Answer | Why |
|---|---|---|
| Use recommended defaults? | **No, customize** | We need control over each option |
| TypeScript? | **No** | Plain JS for speed; Zod gives runtime validation |
| Linter | **ESLint** | Standard, works with Turborepo `lint` task |
| React Compiler? | **No** | No benefit here; avoid surprises with imperative libs like Cytoscape |
| Tailwind CSS? | **Yes** | Required for shadcn/ui and fast UI polish |
| `src/` directory? | **Yes** | Keeps app code separate from config inside the monorepo |
| App Router? | **Yes** | Needed for route handlers (`/api/chat`, `/api/mcp`) and streaming |
| Cache Components? | **No** | Our pages are live and dynamic (streaming agent, changing graph); caching model adds constraints we do not need |
| Customize import alias? | **No** | Keep default `@/*` |
| Include `AGENTS.md`? | **Yes** | Helps coding assistants write current Next.js code; harmless |
| Share anonymized agent feedback? | **No** | Optional telemetry, not needed |

Notes for the JS setup:
- With `src/`, paths become `apps/web/src/app/...`; the layout in 7 applies under `src/`.
- Workspace packages are plain ESM (`"type": "module"` in each `package.json`). Add `transpilePackages: ["@sengra/graph", "@sengra/tools", ...]` in `next.config.mjs` so Next compiles them without a separate build step.
- shadcn/ui supports JavaScript projects: initialize it with TypeScript disabled so components generate as `.jsx`.
- Add a `jsconfig.json` alias (`@/*` -> `src/*`) for editor autocomplete.
- Use JSDoc `@typedef` blocks in `packages/schema` for editor hints, and Zod `parse` at the tool and API boundaries as the real safety net.
- The `@sengra/*` package scope is recommended for workspace packages.

---

## 8. Graph schema

### 8.1 Domain graph (`domain`): fraud core
**Nodes:** `Customer`, `Account`, `Device`, `IPAddress`, `Card`, `Address`, `Transaction`, `Merchant`, `Rule`

| Relationship | Meaning |
|---|---|
| `(Customer)-[:OWNS]->(Account)` | Ownership |
| `(Account)-[:USES]->(Device)` | Login device |
| `(Account)-[:LOGGED_IN_FROM]->(IPAddress)` | Network origin |
| `(Account)-[:HAS_CARD]->(Card)` | Payment instrument |
| `(Account)-[:LIVES_AT]->(Address)` | Registered address |
| `(Account)-[:PAID_TO {amount, ts}]->(Account)` | Money flow |
| `(Transaction)-[:FROM]->(Account)` / `-[:TO]->(Account)` | Txn endpoints |
| `(Transaction)-[:FLAGGED_BY]->(Rule)` | Why flagged |
| `Device.known_bad`, `Account.flagged`, `Account.frozen` | Properties used by policy |

### 8.2 Domain graph: security bonus layer
**Nodes:** `Service`, `Package`, `CVE`, `Exposure`, `Datastore`, `Credential`, `Team`, `Engineer`

| Relationship | Meaning |
|---|---|
| `(Service)-[:DEPENDS_ON]->(Service)` | Dependency graph |
| `(Service)-[:USES_PACKAGE]->(Package)` | Software supply |
| `(Package)-[:AFFECTED_BY]->(CVE)` | Vulnerability |
| `(Service)-[:EXPOSED_VIA]->(Exposure)` | Internet exposure |
| `(Service)-[:READS_FROM]->(Datastore)` | Data access |
| `(Credential)-[:GRANTS_ACCESS_TO]->(Service)` | Credential scope |
| `(Credential)-[:USED_BY]->(Account)` | **Bridge to fraud** |
| `(Team)-[:OWNS_SERVICE]->(Service)`, `(Engineer)-[:ON_CALL_FOR]->(Service)` | Ownership and paging |

### 8.3 Memory graph (`agent_memory`)
```
(AgentRun)-[:INVESTIGATED]->(Case)
(Case)-[:INVOLVES]->(EntityRef {type, id})
(Case)-[:CONCLUDED]->(Outcome {verdict, confidence})
(EntityRef)-[:PREVIOUSLY_CLEARED_IN]->(Case)
(EntityRef)-[:PREVIOUSLY_FLAGGED_IN]->(Case)
(Pattern)-[:LEARNED_FROM]->(Case)
```

### 8.4 Decision graph (`decisions`)
```
(Decision {id, action, ts, policy, confidence})
(Decision)-[:BASED_ON]->(EvidencePath {cypher, nodes, edges, summary})
(Decision)-[:TRIGGERED]->(Action {type, target, status})
(Decision)-[:REVIEWED_BY]->(Human)   // optional
```

---

## 9. MCP tool catalog

All tools are defined once in `packages/tools` with Zod input schemas and registered in `/api/mcp`. Every tool returns a typed result: `{ summary: string, data: ..., subgraph?: {nodes, edges}, path?: string[] }` so the UI can render it directly.

### 9.1 Fraud tools (P0)
| Tool | Input | Output |
|---|---|---|
| `recall_entity` | `type, id` | Prior cases, clearances, flags |
| `get_neighbors` | `id, hops, relTypes?` | Subgraph |
| `find_linked_accounts` | `txnId or accountId, via[]` | Accounts + linking entity |
| `find_rings` | `minSize?` | Components with size and flagged counts (WCC) |
| `rank_central_nodes` | `componentId?, topK` | PageRank / betweenness ranking |
| `detect_communities` | `componentId` | Sub-groups (label propagation in FalkorDB) |
| `analyze_subgraph` | `componentId or accountIds[]` | Louvain communities, betweenness bridge nodes, density, WCC cross-check (graphology) |
| `shortest_path` | `a, b, maxHops` | Path + readable summary |
| `skeptic_challenge` | `accountId or componentId` | Benign explanations found (or none) |
| `evaluate_freeze_policy` | `accountId` | `FREEZE / HOLD / NO_ACTION` + evidence |
| `freeze_account` | `accountId, decisionId` | Simulated freeze, logged |
| `open_case` | `entities[], summary` | Case record in memory graph |
| `notify` | `target, message` | Simulated page/alert |
| `record_decision` | `decision, evidencePath` | Writes decision + memory edges |
| `run_cypher_readonly` | `query` | Rows (guarded fallback) |

### 9.2 Security tools (P2 bonus)
| Tool | Output |
|---|---|
| `blast_radius` | Downstream services, datastores, teams |
| `who_knows_system` | Ranked engineers (worked on, on-call) |
| `reachability_from_exposure` | Assets reachable from the internet (BFS) |
| `evaluate_finding_priority` | CVE severity x exposure x data sensitivity x fraud linkage |
| `cve_to_fraud_links` | CVE -> credential -> account -> flagged accounts |
| `create_ticket` | Ticket assigned to the owning team |

---

## 10. Example Cypher and algorithm calls

> Verify exact procedure names and signatures against the FalkorDB docs for the version you run.

**Linked through shared devices:**
```cypher
MATCH (a:Account {id: $id})-[:USES]->(d:Device)<-[:USES]-(b:Account)
WHERE a <> b
RETURN b.id AS linked, d.id AS via, d.known_bad AS bad_device
```
**Ring detection (WCC):**
```cypher
CALL algo.WCC({nodeLabels: ['Account'], relationshipTypes: ['USES','PAID_TO','LIVES_AT']})
YIELD node, componentId
WITH componentId, collect(node) AS members
RETURN componentId, size(members) AS size,
       size([m IN members WHERE m.flagged = true]) AS flagged
ORDER BY flagged DESC
```
**Central accounts (PageRank):**
```cypher
CALL algo.pageRank('Account', 'PAID_TO') YIELD node, score
RETURN node.id, score ORDER BY score DESC LIMIT 5
```
**Why are A and B connected?**
```cypher
MATCH p = shortestPath((a:Account {id:$a})-[*..6]-(b:Account {id:$b}))
RETURN p
```
**Memory recall:**
```cypher
MATCH (e:EntityRef {id:$id})-[r:PREVIOUSLY_CLEARED_IN|PREVIOUSLY_FLAGGED_IN]->(c:Case)
RETURN type(r) AS history, c.id, c.ts
```
**Bonus: which vulnerable service enables live fraud?**
```cypher
MATCH (cve:CVE)<-[:AFFECTED_BY]-(:Package)<-[:USES_PACKAGE]-(s:Service)
      -[:EXPOSED_VIA]->(:Exposure {internet: true})
MATCH (s)<-[:GRANTS_ACCESS_TO]-(c:Credential)-[:USED_BY]->(a:Account)
WHERE a.flagged = true
RETURN cve.id, s.name, count(DISTINCT a) AS compromised_accounts
ORDER BY compromised_accounts DESC
```

---

## 11. Synthetic data plan (JavaScript, seeded)

Generator in `packages/data` uses `@faker-js/faker` with a fixed seed so every run is reproducible. Target ~1,500 to 3,000 nodes. CLI: `pnpm seed` (loads `domain`), `pnpm seed:reset`.

| Scenario | Planted pattern | Expected agent behavior |
|---|---|---|
| **Ring A: mule ring** | 8 accounts, 2 shared devices (one known bad), circular payments, 1 collector | Detect ring, rank collector via PageRank, freeze core |
| **Ring B: family cluster** | 5 accounts sharing one address and Wi-Fi IP | Skeptic clears; **no freeze** (tests false positives) |
| **Ring C: takeover chain** (bonus) | Exposed vulnerable service -> leaked credentials -> 4 taken-over accounts -> mules | Link CVE to fraud; escalate finding |
| **Noise** | Normal accounts, merchants, coffee-shop IPs | Never flagged |
| **Security decoy** (bonus) | Critical-score CVE on an isolated internal service | Deprioritize with explanation |

`ground_truth.json` records true ring membership so the eval package computes precision and recall automatically.

---

## 12. Memory and cross-session demo

**Session 1:** Alert on transaction T-5521. Memory empty. Agent finds Ring A, passes the freeze gate, freezes core accounts, writes case + evidence.

**Session 2 (fresh request, later):** New alert touches Device D-17. Agent recalls D-17 in Case C-001, skips redundant traversal, expands only new nodes, cites Session 1. UI shows tool calls and time dropping.

---

## 13. UI plan (React, polished)

### 13.1 Screens
| Screen | Contents |
|---|---|
| **Investigate (home)** | Left: chat/alert input. Center: graph canvas. Right: live tool trace + case card |
| **Compare** | Baseline vs graph agent side by side with metrics |
| **Memory** | Prior cases, cleared entities, learned patterns as a small graph |

### 13.2 Graph canvas (Cytoscape.js)
- Node styling by type (account, device, card, address) and state (flagged = red glow, frozen = locked icon, cleared = green).
- **Animated evidence path:** edges light up in sequence matching the explanation sentence.
- Click a node to see properties and run "expand neighbors".
- Layout switch (force-directed / concentric by PageRank). Node size scales with PageRank score.
- Ring highlight: component drawn as a soft hull.

### 13.3 Reasoning trace panel
Streams each MCP tool call as it happens: tool name, arguments, one-line result summary, duration. Memory hits are badged. Expandable to show raw Cypher.

### 13.4 Case report card
Decision badge (FREEZE / HOLD / NO ACTION), confidence, plain-English explanation, evidence path chips, memory references, "copy report" button.

### 13.5 Design direction
Dark, high-contrast "ops console" look; Tailwind + shadcn/ui; Framer Motion for path animation and panel transitions; skeleton loaders; keyboard-friendly; responsive down to tablet. Prebuilt demo alerts as one-click buttons so the demo never depends on typing.

### 13.6 Streaming contract
Tool results carry a typed `subgraph` and `path`. The `/api/chat` stream sends them as message parts; the UI merges subgraphs into the canvas as they arrive, so the graph builds up while the agent thinks.

---

## 14. Explainability output format
```json
{
  "decision": "FREEZE",
  "target": "A-482",
  "confidence": 0.91,
  "policy": "freeze_policy_v1",
  "explanation": "A-482 shares Device D-17 (known bad) with A-901, which paid A-233. The 6-account component has 4 flagged accounts. No prior clearance in memory.",
  "evidencePath": ["A-482","USES","D-17","USED_BY","A-901","PAID_TO","A-233"],
  "cypher": "MATCH p=...",
  "memoryRefs": ["case:C-001"],
  "toolsUsed": ["recall_entity","find_rings","shortest_path","evaluate_freeze_policy"]
}
```

---

## 15. Evaluation and baseline

| Metric | Baseline (no graph) | Sengra (graph) |
|---|---|---|
| Rings found (of planted) | measured | measured |
| False positives (family cluster) | measured | measured |
| Tool calls per case | measured | measured |
| Time to decision | measured | measured |
| Explanation includes path? | No | Yes |
| Run 2 speedup from memory | N/A | measured |

Baseline = same model and data exposed as flat JSON/tables with keyword lookup only, no traversal or algorithm tools. Runs via `pnpm eval` and the `/compare` page.

---

## 16. Safety and guardrails
- `run_cypher_readonly` uses `roQuery` plus allow-list, row limit, and timeout.
- `/api/mcp` requires `MCP_SHARED_SECRET`; `/api/chat` has basic rate limiting.
- Actions are **simulated** and logged in `decisions`; high-impact actions need confidence >= threshold or route to HOLD.
- All data synthetic; no real PII. API keys only in Vercel env vars.

---

## 17. Solo build plan (scope is cut in this order)

| Day | Deliverable | Cut if behind |
|---|---|---|
| 1 | Turborepo scaffold, FalkorDB Cloud instance + connection test, schema, seeded data with Ring A and B, inspect in the cloud console | n/a |
| 2 | `graph`, `tools`, `analysis`, `policy` packages; Vitest tests for ring detection, PageRank, freeze policy (no LLM) | n/a |
| 3 | MCP route, `/api/chat` agent loop, action tools, first end-to-end run | n/a |
| 4 | Memory + decisions graphs, evidence path, Skeptic, two-session demo | n/a |
| 5 | React UI: graph canvas, tool trace, case card; deploy to Vercel + hosted FalkorDB | Memory page, layout switch |
| 6 | Baseline compare page, eval numbers, README, demo video | Multi-agent |
| 7 (bonus) | Security layer and CVE-to-fraud bridge (Ring C) | Entire security layer |

**Rule:** if fraud core and UI are not solid by end of Day 6, skip the security layer entirely and say so honestly in the README as "future work".

---

## 18. Judging criteria mapping

| Criterion | How Sengra addresses it |
|---|---|
| Multi-hop reasoning | Account -> device -> account -> payment chains; (bonus) CVE -> credential -> account |
| Graph queries/algorithms as tools | WCC, PageRank, betweenness, label propagation, shortest path via MCP |
| Tool selection through MCP | Runtime discovery; trace shows different tools per question |
| Actions based on the graph | Freeze gated by graph policy, plus a deliberate no-action case (family cluster) |
| Explainable results | Evidence path stored as edges, narrated, and animated on the graph |
| Remember across sessions | `agent_memory` graph; Session 2 cites Session 1 |
| Share state between agents | Stretch: Investigator/Skeptic/Actioner coordinate through the graph |

---

## 19. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Solo scope creep | Strict priority tiers (P0-P3); security layer is optional |
| FalkorDB cannot run on Vercel | FalkorDB Cloud (managed); documented in README |
| Cloud plan limits / latency | Small dataset, cached client, prefixed dev/prod graphs, function region near the DB region |
| graphology differs from NetworkX | Use only well-supported algorithms; unit-test against known small graphs |
| Serverless timeouts / cold starts | `maxDuration`, cached DB client, small fast tools, streaming |
| SDK/API version drift (AI SDK, MCP adapter) | Pin versions; isolate in thin wrappers inside `packages/tools` and `apps/web` |
| Algorithm syntax differences | Wrap in tested helper functions; pin FalkorDB image tag |
| LLM writes bad Cypher | Fixed toolset; read-only fallback only |
| Demo fragility | Seeded data, one-click demo alerts, recorded backup video |
| Contrived data | Noise, family cluster false-positive test, decoys |

---

## 20. Open items
None blocking. Graphology is confirmed as the NetworkX stand-in. Deadline planning and the demo video are handled outside this plan.

---

## 21. Success definition
A reviewer opens the deployed site, clicks a demo alert, watches the agent pick graph tools while the subgraph builds on screen, sees a freeze happen only where the graph supports it, sees the family cluster correctly left alone, reruns in a fresh session and watches memory change the result, and clicks any decision to see the animated path that justified it.