"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Database,
  Terminal,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Brain,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  FileCode,
  Network,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  Copy,
  Check,
  BookOpen,
  Fingerprint,
  RefreshCw,
  Search,
} from "lucide-react";

const MCP_TOOLS = [
  {
    name: "recall_entity",
    category: "Graph Retrieval",
    description: "Retrieve 1-hop or 2-hop graph neighborhood for an entity (Account, Device, IP, Card).",
    params: {
      id: "string (required) — Unique identifier of the entity to recall",
      type: "string — Entity type (Account, Device, IPAddress, Card, Customer, Address)",
      hops: "integer (1-3, default 1) — Graph traversal hop distance",
    },
    exampleQuery: "MATCH (a:Account {id: $id})-[r*1..2]-(n) RETURN a, r, n LIMIT 50",
  },
  {
    name: "detect_communities",
    category: "Topological Analytics",
    description: "Run graph community detection and component partitioning on a suspect subgraph.",
    params: {
      componentId: "string (optional) — Component identifier to partition",
      algorithm: "enum ('louvain' | 'wcc', default 'louvain')",
    },
    exampleQuery: "CALL algo.louvain($subgraph) YIELD communityId, nodeId",
  },
  {
    name: "analyze_subgraph",
    category: "Topological Analytics",
    description: "In-process Graphology topological analytics (Louvain communities, betweenness centrality, bridge detection).",
    params: {
      nodes: "array<object> — List of graph nodes with { id, label, properties }",
      edges: "array<object> — List of graph edges with { source, target, type }",
      componentId: "string (optional) — Component ID to pull from database if nodes/edges omitted",
    },
    exampleQuery: "graphology.betweennessCentrality(graph) // Pinpoints mule bridges",
  },
  {
    name: "shortest_path",
    category: "Topological Analytics",
    description: "Compute the shortest graph path between two accounts or entities in FalkorDB.",
    params: {
      a: "string (required) — Source entity identifier",
      b: "string (required) — Target entity identifier",
      maxHops: "integer (1-6, default 4) — Maximum search hops",
    },
    exampleQuery: "MATCH p = shortestPath((a:Account {id: $a})-[*..4]-(b:Account {id: $b})) RETURN p",
  },
  {
    name: "skeptic_challenge",
    category: "Skeptic Verification",
    description: "Evaluate benign alternative explanations (family cluster sharing address/Wi-Fi, merchant hub, past clearance).",
    params: {
      accountId: "string (required) — Account ID being scrutinized",
      hasSharedAddress: "boolean — Whether entity shares a residential address",
      hasSharedIp: "boolean — Whether entity shares a home network IP",
      badDevices: "array<string> — List of known bad devices connected",
      hasCircularPayments: "boolean — Whether circular money transfer loops exist",
      previouslyCleared: "boolean — Whether cleared in historical audit case",
    },
    exampleQuery: "pure deterministic check: sharedAddress && sharedIp && badDevices.length === 0 && !hasCircular",
  },
  {
    name: "evaluate_freeze_policy",
    category: "Policy Gating",
    description: "Evaluate graph evidence against deterministic policy rules (Rule F4) to decide FREEZE, HOLD, or NO_ACTION.",
    params: {
      accountId: "string (required) — Account ID to evaluate",
      flaggedInComponent: "integer — Count of flagged accounts in connected component",
      hopsToBadDevice: "number — Distance to nearest known-bad device",
      previouslyCleared: "boolean — Whether cleared in prior audit case",
      crossCheckPassed: "boolean — Whether FalkorDB and Graphology WCC cross-check matched",
      evidencePath: "array<string> — Graph node IDs supporting evidence",
    },
    exampleQuery: "Rule F4: flaggedCount >= 3 && hopsToBadDevice <= 2 && !previouslyCleared && crossCheckPassed",
  },
  {
    name: "freeze_account",
    category: "Mitigation Actuation",
    description: "Execute simulated account freeze action and log to audit ledger.",
    params: {
      accountId: "string (required) — Account ID to freeze",
      decisionId: "string (optional) — ID of the approved policy decision",
      reason: "string — Detailed rationale for the action",
    },
    exampleQuery: "MATCH (a:Account {id: $accountId}) SET a.frozen = true, a.frozenAt = timestamp()",
  },
  {
    name: "open_case",
    category: "Case Management",
    description: "Create an active fraud investigation case record in agent memory.",
    params: {
      title: "string (required) — Summary title of the investigation",
      target: "string (required) — Primary entity ID under investigation",
      caseId: "string (optional) — Unique identifier for case",
      severity: "enum ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', default 'HIGH')",
    },
    exampleQuery: "CREATE (c:Case {id: $caseId, target: $target, status: 'OPEN', createdAt: timestamp()})",
  },
  {
    name: "notify",
    category: "Mitigation Actuation",
    description: "Dispatch simulated risk alert or notification to compliance officers.",
    params: {
      message: "string (required) — Notification body text",
      target: "string (required) — Entity identifier",
      channel: "enum ('slack' | 'email' | 'webhook', default 'slack')",
      severity: "enum ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')",
    },
    exampleQuery: "webhook.dispatch({ channel: 'slack', text: '[CRITICAL ALERT] Ring A Freeze Executed' })",
  },
  {
    name: "record_decision",
    category: "Audit & Ledger",
    description: "Save final investigation decision, evidence path, and Cypher query to the decisions audit graph.",
    params: {
      decision: "enum ('FREEZE' | 'HOLD' | 'NO_ACTION') — Policy verdict",
      target: "string (required) — Entity ID evaluated",
      confidence: "number (0-1) — Confidence score",
      policy: "string — Policy version identifier",
      explanation: "string (required) — Human-readable explanation of verdict",
      evidencePath: "array<string> — Traversal node path",
      cypher: "string (optional) — Cypher query executed during investigation",
    },
    exampleQuery: "CREATE (d:Decision {target: $target, verdict: $decision, evidence: $evidencePath})",
  },
  {
    name: "run_cypher_readonly",
    category: "Graph Retrieval",
    description: "Execute a read-only Cypher query with row limit guardrails against FalkorDB.",
    params: {
      query: "string (required) — Read-only Cypher query (blocks CREATE, DELETE, SET, etc.)",
      params: "object — Parameterized bindings for the query",
      limit: "integer (1-1000, default 100) — Maximum rows to return",
    },
    exampleQuery: "MATCH (a:Account)-[:TRANSFERRED_TO]->(b:Account) RETURN a.id, b.id, count(*) LIMIT 100",
  },
  {
    name: "cve_to_fraud_links",
    category: "Security Cross-Domain",
    description: "Trace cross-domain graph query connecting CVE vulnerability to compromised accounts via leaked credentials.",
    params: {
      cveId: "string (optional) — CVE identifier (e.g. CVE-2024-3094)",
      serviceId: "string (optional) — Vulnerable service ID",
    },
    exampleQuery: "MATCH (c:CVE)-[:AFFECTS]->(s:Service)-[:READS_FROM]->(d:Datastore)-[:CONTAINS]->(cred:Credential)-[:USED_BY]->(a:Account) RETURN c, s, a",
  },
  {
    name: "blast_radius",
    category: "Security Cross-Domain",
    description: "Calculate downstream service dependencies and affected datastores from a compromised service.",
    params: {
      serviceId: "string (required) — Vulnerable service ID",
    },
    exampleQuery: "MATCH (s:Service {id: $serviceId})-[:DEPENDS_ON*1..4]->(downstream:Service) RETURN downstream",
  },
  {
    name: "evaluate_finding_priority",
    category: "Security Cross-Domain",
    description: "Calculate finding priority score factoring in exposure, data sensitivity, and live fraud linkage.",
    params: {
      cveId: "string (required) — CVE identifier",
      cvss: "number (0-10, required) — CVSS base score",
      isInternetExposed: "boolean — Whether service is exposed to public internet",
      hasCustomerPII: "boolean — Whether service handles customer PII",
      isFraudLinked: "boolean — Whether vulnerability is actively linked to financial fraud",
    },
    exampleQuery: "Priority P0 if isFraudLinked && cvss >= 9.0; P1 if isInternetExposed && hasCustomerPII",
  },
  {
    name: "who_knows_system",
    category: "Security Cross-Domain",
    description: "Identify owning engineering team, tech lead, and on-call responders for incident paging.",
    params: {
      serviceId: "string (required) — Target service ID",
    },
    exampleQuery: "MATCH (s:Service {id: $serviceId})-[:OWNED_BY]->(t:Team)-[:ON_CALL]->(e:Engineer) RETURN t, e",
  },
];

const SECTIONS = [
  { id: "overview", label: "1. System Topology" },
  { id: "graph-schema", label: "2. FalkorDB Graph Schema" },
  { id: "mcp-tools", label: "3. 15 MCP Tools Catalog" },
  { id: "policy-f4", label: "4. Rule F4 Policy Engine" },
  { id: "skeptic", label: "5. Skeptic Challenge Engine" },
  { id: "memory", label: "6. Associative Memory Ledger" },
  { id: "sarvam-ai", label: "7. Sarvam 105B AI Integration" },
  { id: "security-bridge", label: "8. Security Bonus Bridge" },
  { id: "playground", label: "9. Interactive AI Playground" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [toolSearch, setToolSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState(MCP_TOOLS[0]);
  const [copiedCode, setCopiedCode] = useState("");

  // Interactive Sarvam AI Playground State
  const [aiPrompt, setAiPrompt] = useState("Explain why collector mules are missed by single-hop SQL rules and how Rule F4 catches them.");
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  function handleCopy(text, key) {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(""), 2000);
  }

  async function handleSendAiPrompt(e) {
    if (e) e.preventDefault();
    if (!aiPrompt.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch("/api/sarvam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: {
            accountId: "A-RINGA-COLLECTOR",
            flaggedInComponent: 8,
            hopsToBadDevice: 2,
            decision: "FREEZE",
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setAiResponse(data.message.content);
      } else {
        setAiResponse("Analysis received, but response format was unexpected.");
      }
    } catch (err) {
      setAiResponse(`Forensic Engine Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  }

  const filteredTools = MCP_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(toolSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(toolSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_12px_rgba(34,211,238,0.25)]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-zinc-100 flex items-center gap-2 font-mono">
              SENGRA <span className="text-zinc-600">//</span> TECHNICAL DOCUMENTATION
            </h1>
            <p className="text-xs text-zinc-400">
              Complete Specification: Graph Schema, 15 MCP Tools, Rule F4, and Sarvam AI 105B
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about"
            className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
          >
            &larr; The Problem / About Us
          </Link>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
          >
            Ops Console
          </Link>
          <Link
            href="/compare"
            className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
          >
            Benchmark View
          </Link>
          <Link
            href="/memory"
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono transition-colors"
          >
            Memory
          </Link>
          <Link
            href="/security"
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono transition-colors"
          >
            Security Ops
          </Link>
        </div>
      </header>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Left Sticky Table of Contents */}
        <aside className="hidden lg:block w-64 border-r border-zinc-800 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto space-y-6">
          <div>
            <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider mb-3">
              Table of Contents
            </div>
            <nav className="space-y-1">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeSection === sec.id
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {sec.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-2 text-xs text-zinc-400 font-mono">
            <div className="text-zinc-300 font-semibold">System Specs</div>
            <div>&bull; Graph: FalkorDB TLS</div>
            <div>&bull; Protocol: MCP 2024-11</div>
            <div>&bull; Policy: Rule F4 Gated</div>
            <div>&bull; AI: Sarvam 105B</div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-6 md:p-10 space-y-16 overflow-y-auto">
          {/* Section 1: Overview & Architecture Pipeline */}
          <section id="overview" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                SYSTEM TOPOLOGY
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                1. Graph-Native Autonomous Investigation Pipeline
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                SENGRA unifies sub-millisecond in-memory graph queries (FalkorDB), modular tool execution via Model Context Protocol (MCP), 
                pure deterministic decision gating (Rule F4), active counter-factual testing (Skeptic challenge), and high-capacity conversational AI (Sarvam 105B).
              </p>
            </div>

            {/* Architecture Flowchart Card */}
            <div className="rounded-2xl p-6 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 space-y-4">
              <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
                Autonomous 6-Stage Execution Lifecycle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                {[
                  { step: "01", name: "Recall", tool: "recall_entity", desc: "Retrieve 2-hop neighborhood in FalkorDB" },
                  { step: "02", name: "Topology", tool: "analyze_subgraph", desc: "Run Louvain & betweenness centrality" },
                  { step: "03", name: "Skeptic", tool: "skeptic_challenge", desc: "Test benign family cluster hypothesis" },
                  { step: "04", name: "Policy Gate", tool: "evaluate_freeze_policy", desc: "Strict Rule F4 deterministic evaluation" },
                  { step: "05", name: "Mitigation", tool: "freeze_account / notify", desc: "Actuate freeze and dispatch risk alert" },
                  { step: "06", name: "Ledger & AI", tool: "record_decision / sarvam", desc: "Save audit graph & Sarvam AI briefing" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{item.step}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">{item.name}</span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-zinc-200">{item.tool}</div>
                    <div className="text-[11px] text-zinc-400 leading-snug">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: FalkorDB Graph Schema */}
          <section id="graph-schema" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                KNOWLEDGE GRAPH SCHEMA
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                2. FalkorDB Graph Schema &amp; Cypher Queries
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                The SENGRA knowledge graph models entities, identities, financial instruments, and security infrastructure as a typed property graph.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nodes Card */}
              <div className="rounded-2xl p-6 bg-zinc-900/40 border border-zinc-800 space-y-4">
                <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Graph Node Schemas (Zod Validated)
                </h3>
                <ul className="space-y-2.5 text-xs text-zinc-300 font-mono">
                  <li className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <strong className="text-cyan-300">(:Account)</strong> &mdash; <code>{`{ id: string, flagged: bool, frozen: bool, createdAt: ts }`}</code>
                  </li>
                  <li className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <strong className="text-cyan-300">(:Customer)</strong> &mdash; <code>{`{ id: string, name: string, email: string, riskScore: 0..1 }`}</code>
                  </li>
                  <li className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <strong className="text-red-400">(:Device)</strong> &mdash; <code>{`{ id: string, known_bad: bool, fingerprint: hash }`}</code>
                  </li>
                  <li className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <strong className="text-purple-300">(:IPAddress)</strong> &mdash; <code>{`{ id: string, ip: string, isProxy: bool }`}</code>
                  </li>
                  <li className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <strong className="text-amber-300">(:Card)</strong> &mdash; <code>{`{ id: string, last4: string, expMonth: 1..12, expYear: int }`}</code>
                  </li>
                  <li className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <strong className="text-zinc-300">(:Address)</strong> &mdash; <code>{`{ id: string, street: string, city: string, zip: string }`}</code>
                  </li>
                  <li className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <strong className="text-emerald-300">(:Transaction)</strong> &mdash; <code>{`{ id: string, amount: float, ts: int, flagged: bool }`}</code>
                  </li>
                </ul>
              </div>

              {/* Edges & Cypher Card */}
              <div className="rounded-2xl p-6 bg-zinc-900/40 border border-zinc-800 space-y-4">
                <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Relationships &amp; Core Cypher Queries
                </h3>
                <div className="space-y-3">
                  <div className="text-xs text-zinc-400">
                    Relationships: <code>[:USED]</code>, <code>[:HAS_ADDRESS]</code>, <code>[:CONNECTED_TO]</code>, <code>[:TRANSFERRED_TO]</code>, <code>[:ADDED_PAYMENT]</code>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Multi-Hop Mule Ring Traversal</span>
                      <button
                        onClick={() => handleCopy("MATCH p = (a:Account {id: $id})-[:USED*1..2]-(d:Device {known_bad: true}) RETURN p", "c1")}
                        className="text-zinc-500 hover:text-cyan-400"
                      >
                        {copiedCode === "c1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
{`MATCH p = (a:Account {id: $id})-[:USED*1..2]-(d:Device {known_bad: true})
RETURN p LIMIT 25;`}
                    </pre>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Circular Transaction Cycle Detection</span>
                      <button
                        onClick={() => handleCopy("MATCH (a:Account)-[:TRANSFERRED_TO]->(b:Account)-[:TRANSFERRED_TO]->(c:Account)-[:TRANSFERRED_TO]->(a:Account) RETURN a, b, c", "c2")}
                        className="text-zinc-500 hover:text-cyan-400"
                      >
                        {copiedCode === "c2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
{`MATCH (a:Account)-[:TRANSFERRED_TO]->(b:Account)-[:TRANSFERRED_TO]->(c:Account)-[:TRANSFERRED_TO]->(a:Account)
RETURN a.id, b.id, c.id LIMIT 10;`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: 15 MCP Tools Catalog */}
          <section id="mcp-tools" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                PROTOCOL DECOUPLING
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                3. The 15 MCP Tool Catalog &amp; Execution Specifications
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                Every investigative tool conforms to the Model Context Protocol (MCP 2024-11-05 JSON-RPC 2.0 specification). 
                Tools can be queried via <code>GET /api/mcp</code> and executed via <code>POST /api/mcp</code>.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter 15 MCP tools by name, category, or parameter..."
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="text-xs font-mono text-zinc-400 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                {filteredTools.length} / 15 Tools Active
              </div>
            </div>

            {/* Interactive Tool Grid & Detail Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tool List Column */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredTools.map((tool) => {
                  const isSelected = selectedTool.name === tool.name;
                  return (
                    <button
                      key={tool.name}
                      onClick={() => setSelectedTool(tool)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-cyan-500/10 border-cyan-500/40 text-white shadow-md"
                          : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-zinc-200">{tool.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">{tool.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Tool Detail Inspector Column */}
              <div className="lg:col-span-2 rounded-2xl p-6 bg-zinc-900/40 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      {selectedTool.name}
                    </h3>
                    <span className="text-xs font-mono text-cyan-400">{selectedTool.category}</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                    JSON-RPC 2.0 tool/call
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-zinc-400">Description</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedTool.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-zinc-400">Parameters Schema</div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    {Object.entries(selectedTool.params).map(([param, typeDesc]) => (
                      <div key={param} className="text-xs font-mono flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-cyan-400 font-semibold">{param}:</span>
                        <span className="text-zinc-400 text-[11px]">{typeDesc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-zinc-400">Underlying Query / Implementation</div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <pre className="text-xs font-mono text-purple-300 overflow-x-auto whitespace-pre-wrap">
                      {selectedTool.exampleQuery}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Rule F4 Policy Engine */}
          <section id="policy-f4" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                DETERMINISTIC ACTION GATING
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                4. Rule F4 Policy Engine: Zero Hallucinated Freezes
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                Unlike experimental LLM agents that take high-risk banking actions based on probabilistic text generation, 
                SENGRA enforces a mathematically pure deterministic policy gate. LLMs provide reasoning, but the policy engine dictates the action.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-zinc-900/40 border border-amber-500/30 space-y-4">
              <h3 className="text-sm font-bold text-amber-300 font-mono uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                The Rule F4 Strict Truth Contract
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                An account is <strong>ONLY</strong> approved for automated freezing if all four clauses evaluate to TRUE:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
                    Substantial Flagged Ring (flaggedCount &gt;= 3)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    The target account must belong to a connected component containing at least 3 confirmed or flagged accounts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
                    Bad Device Proximity (hopsToBadDevice &lt;= 2)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    The target account must be within a maximum of 2 hops of a verified malicious hardware rig or leaked credential.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
                    No Prior Audit Clearance (!previouslyCleared)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    The associative memory ledger must not contain an active clearance certificate for this entity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">4</span>
                    Skeptic Challenge Passed (!isBenign)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    The Skeptic protocol must have verified that no benign household or legitimate business explanation applies.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Fallback routing for partial evidence:</span>
                <span className="text-amber-400 font-bold">HOLD for Senior Analyst Manual Review</span>
              </div>
            </div>
          </section>

          {/* Section 5: Skeptic Challenge Protocol */}
          <section id="skeptic" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                FALSE POSITIVE REDUCTION
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                5. Skeptic Challenge: Counter-Factual Verification
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                Before any punitive action is taken, SENGRA intentionally runs a counter-factual verification subroutine to clear benign clusters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 bg-zinc-900/40 border border-zinc-800 space-y-3">
                <h3 className="text-sm font-bold text-emerald-300 font-mono">
                  Benign Family Cluster Verification (Ring B)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  When 5 family members (parents, children) live in the same house, they share the exact same physical street address and residential Wi-Fi router. 
                  A legacy tabular rule flags this as an illicit cluster of 5 accounts.
                </p>
                <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-500/20 text-xs font-mono text-emerald-300 space-y-1">
                  <div>&bull; Shared residential address: DETECTED</div>
                  <div>&bull; Shared residential Wi-Fi: DETECTED</div>
                  <div>&bull; Known bad devices: ZERO (0)</div>
                  <div>&bull; Circular payment churn: NONE</div>
                  <div className="pt-1 text-white font-bold">&rarr; SKEPTIC CLEARS: NO_ACTION</div>
                </div>
              </div>

              <div className="rounded-2xl p-6 bg-zinc-900/40 border border-zinc-800 space-y-3">
                <h3 className="text-sm font-bold text-cyan-300 font-mono">
                  Historical Clearance Memory Citation
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  If an account was investigated in a prior session (e.g. <code>CASE-2026-001</code>) and cleared by a compliance officer, 
                  SENGRA remembers that clearance. Unless new illicit hardware is linked, the account is protected from redundant freezes.
                </p>
                <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-500/20 text-xs font-mono text-cyan-300 space-y-1">
                  <div>&bull; Historical Case: CASE-2026-001</div>
                  <div>&bull; Clearance Status: ACTIVE</div>
                  <div>&bull; New Hardware Added: NONE</div>
                  <div className="pt-1 text-white font-bold">&rarr; REDUNDANT ALERT DISMISSED</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Associative Memory */}
          <section id="memory" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                IMMUTABLE AUDIT TRAIL
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                6. Associative Memory &amp; Cross-Session Decisions Graph
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                Every investigation decision is recorded to an audit graph with the full traversed evidence path and executed Cypher queries.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold">
                  Decision Schema Format (Zod Validated)
                </h3>
                <Link href="/memory" className="text-xs font-mono text-amber-400 hover:underline">
                  Launch Memory Explorer &rarr;
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-amber-300 overflow-x-auto">
{`{
  "id": "DEC-2026-0891",
  "decision": "FREEZE",
  "target": "A-RINGA-COLLECTOR",
  "confidence": 0.95,
  "policy": "freeze_policy_v1",
  "explanation": "Account A-RINGA-COLLECTOR is part of an 8-account flagged component and within 2 hops of known-bad device D-17. Gated freeze approved.",
  "evidencePath": ["A-RINGA-COLLECTOR", "D-18", "A-RINGA-2", "D-17"],
  "cypher": "MATCH p = (a:Account {id: 'A-RINGA-COLLECTOR'})-[:USED*1..2]-(d:Device {known_bad: true}) RETURN p",
  "timestamp": "2026-10-16T22:30:00Z"
}`}
              </div>
            </div>
          </section>

          {/* Section 7: Sarvam AI 105B Conversations Integration */}
          <section id="sarvam-ai" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
                CONVERSATIONAL FORENSICS
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                7. Sarvam AI 105B Conversations Integration
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                SENGRA connects the Sarvam 105B Conversations model to translate raw topological graph evidence into high-impact, 
                natural language briefings for risk officers and regulatory audits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 bg-zinc-900/40 border border-pink-500/20 space-y-4">
                <h3 className="text-sm font-bold text-pink-300 font-mono">
                  Integration Architecture &amp; API Endpoint
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Available through <code>/api/sarvam</code> and integrated into <code>/api/chat</code>. 
                  Calls the Sarvam API with header <code>api-subscription-key</code> and model <code>sarvam-105b-conversations</code>.
                </p>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1">
                  <div>POST https://api.sarvam.ai/v1/chat/completions</div>
                  <div>Headers: &ldquo;api-subscription-key: sk_mhp6zj...&rdquo;</div>
                  <div>Body: {`{ model: "sarvam-105b-conversations", stream: true }`}</div>
                </div>
              </div>

              <div className="rounded-2xl p-6 bg-zinc-900/40 border border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold text-zinc-200 font-mono">
                  Indic Multilingual Forensic Capabilities
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sarvam 105B delivers specialized reasoning for regional financial ecosystems, including UPI mule accounts, 
                  cybercrime helpline 1930 incident reports, and local language intelligence summaries across 10+ Indian languages.
                </p>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-pink-400">
                  Supported Rails: UPI, IMPS, RTGS, FedNow, Swift, SEPA
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: Security Bonus Layer */}
          <section id="security-bridge" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                CROSS-DOMAIN OPS
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                8. Security Bonus Layer: CVE to Fraud Bridge
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                Breaches and financial fraud are two sides of the same coin. SENGRA connects CVE vulnerabilities in upstream packages 
                directly to leaked credential hashes and compromised victim accounts.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-zinc-900/40 border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-purple-300 font-bold">
                  CVE-2024-3094 Compromise Chain
                </h3>
                <Link href="/security" className="text-xs font-mono text-purple-400 hover:underline">
                  Launch Security Ops View &rarr;
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-purple-300 leading-relaxed">
                (:CVE &#123;id: &lsquo;CVE-2024-3094&rsquo;&#125;) &rarr; [:AFFECTS] &rarr; (:Package &#123;name: &lsquo;xz-utils@5.6.0&rsquo;&#125;) &rarr; [:USES_PACKAGE] &rarr; (:Service &#123;name: &lsquo;Auth Portal&rsquo;&#125;) &rarr; [:READS_FROM] &rarr; (:Datastore &#123;name: &lsquo;User Credentials&rsquo;&#125;) &rarr; [:COMPROMISED] &rarr; (:Account &#123;id: &lsquo;A-TAKEOVER-1&rsquo;&#125;)
              </div>
            </div>
          </section>

          {/* Section 9: Interactive AI Playground */}
          <section id="playground" className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                LIVE INTERACTION
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                9. Interactive Sarvam AI Forensic Playground
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                Test Sarvam 105B Conversations live. Ask forensic AML questions, request topological explanations of mule structures, or probe policy rules.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-zinc-900/40 border border-cyan-500/30 space-y-4">
              <form onSubmit={handleSendAiPrompt} className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Forensic Prompt</span>
                  <span className="text-cyan-400">Model: sarvam-105b-conversations</span>
                </div>
                <div className="flex gap-2">
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask a forensic question (e.g., How does smurfing evade regulatory detection?)"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-100 focus:outline-none focus:border-cyan-500/50 resize-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAiPrompt("Explain how Sarvam 105B Conversations integrates with FalkorDB graph topology.")}
                      className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    >
                      Topological Query
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiPrompt("Detail the Skeptic Challenge protocol for clearing family clusters.")}
                      className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    >
                      Skeptic Protocol
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isAiLoading || !aiPrompt.trim()}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)] disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Ask Sarvam AI
                      </>
                    )}
                  </button>
                </div>
              </form>

              {aiResponse && (
                <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Sarvam 105B Forensic Response:
                    </span>
                    <button
                      onClick={() => handleCopy(aiResponse, "res")}
                      className="text-zinc-500 hover:text-cyan-400"
                    >
                      {copiedCode === "res" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
