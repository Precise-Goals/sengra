"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
  ArrowRight,
  Clock,
  FileText,
  Network,
  Database,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const DEMO_PAST_CASES = [
  {
    caseId: "CASE-2026-001",
    targetEntity: "A-RINGB-1",
    entityType: "Account",
    verdict: "NO_ACTION",
    confidence: 0.92,
    category: "BENIGN_FAMILY_CLUSTER",
    timestamp: "2026-10-16T04:15:00Z",
    summary: "Benign household cluster sharing residential Wi-Fi and address (ADDR-FAMILY-01). Zero bad devices. Cleared via Skeptic challenge.",
    evidenceNodes: ["A-RINGB-1", "ADDR-FAMILY-01", "IP-FAMILY-WIFI"],
    cleared: true,
  },
  {
    caseId: "CASE-2026-002",
    targetEntity: "A-RINGB-2",
    entityType: "Account",
    verdict: "NO_ACTION",
    confidence: 0.94,
    category: "BENIGN_FAMILY_CLUSTER",
    timestamp: "2026-10-16T04:15:30Z",
    summary: "Co-resident parent account in cleared family cluster. Cites CASE-2026-001 clearance.",
    evidenceNodes: ["A-RINGB-2", "ADDR-FAMILY-01"],
    cleared: true,
  },
  {
    caseId: "CASE-2026-003",
    targetEntity: "A-RINGA-1",
    entityType: "Account",
    verdict: "FREEZE",
    confidence: 0.95,
    category: "MULE_RING_SYNDICATE",
    timestamp: "2026-10-16T04:20:00Z",
    summary: "Connected to confirmed fraud rig D-17 within 1 hop. Part of 8-account structuring component. Gated freeze approved per Rule F4.",
    evidenceNodes: ["A-RINGA-1", "D-17", "A-RINGA-COLLECTOR"],
    cleared: false,
  },
  {
    caseId: "CASE-2026-004",
    targetEntity: "A-RINGA-COLLECTOR",
    entityType: "Account",
    verdict: "FREEZE",
    confidence: 0.96,
    category: "MULE_RING_SYNDICATE",
    timestamp: "2026-10-16T04:21:00Z",
    summary: "Collector mule account aggregating payments from 7 feeder mules. 2 hops to bad device D-17.",
    evidenceNodes: ["A-RINGA-COLLECTOR", "A-RINGA-2", "D-17"],
    cleared: false,
  },
  {
    caseId: "CASE-2026-005",
    targetEntity: "A-TAKEOVER-1",
    entityType: "Account",
    verdict: "FREEZE",
    confidence: 0.98,
    category: "SECURITY_CREDENTIAL_TAKEOVER",
    timestamp: "2026-10-16T04:35:00Z",
    summary: "Targeted by credential-stuffing attack exploiting upstream auth vulnerability CVE-2024-3094. Account frozen proactively.",
    evidenceNodes: ["A-TAKEOVER-1", "CRED-LEAKED-HASH", "SVC-AUTH-PORTAL", "CVE-2024-3094"],
    cleared: false,
  },
];

export default function MemoryPage() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(DEMO_PAST_CASES[0]);

  const filteredCases = DEMO_PAST_CASES.filter((item) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "CLEARED" && item.verdict === "NO_ACTION") ||
      (filter === "FROZEN" && item.verdict === "FREEZE");
    const matchesSearch =
      item.targetEntity.toLowerCase().includes(search.toLowerCase()) ||
      item.caseId.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#020408] text-zinc-100 flex flex-col font-sans selection:bg-[#00ff66]/30 selection:text-white">
      {/* Page Title & Status Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="liquid-glass-extreme p-5 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-sans text-white">
                  Memory Explorer &amp; Cross-Session Audit
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  agent_memory active
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Associative recall and immutable audit trail of past investigations, clearance citations, and gated decisions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>5 Active Cached Cases</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Memory Graph Nodes
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">agent_memory</div>
            <div className="mt-1 text-xs text-zinc-400">Persistent cases &amp; entity clearances</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Prior Clearances
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">2 Accounts</div>
            <div className="mt-1 text-xs text-zinc-400">Skeptic verified benign clusters</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Audit Decisions
              <History className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">5 Decisions</div>
            <div className="mt-1 text-xs text-zinc-400">Immutable decisions audit graph</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Recall Latency
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-400">&lt; 5 ms</div>
            <div className="mt-1 text-xs text-zinc-400">Associative graph index traversal</div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by account ID, case ID, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filter === "ALL" ? "bg-zinc-800 text-zinc-100 border border-zinc-700" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All ({DEMO_PAST_CASES.length})
            </button>
            <button
              onClick={() => setFilter("CLEARED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filter === "CLEARED" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Cleared
            </button>
            <button
              onClick={() => setFilter("FROZEN")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filter === "FROZEN" ? "bg-red-500/20 text-red-300 border border-red-500/30" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Frozen
            </button>
          </div>
        </section>

        {/* Split Grid: Cases List & Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredCases.map((item) => {
              const isSelected = selectedCase.caseId === item.caseId;
              const isFreeze = item.verdict === "FREEZE";
              return (
                <div
                  key={item.caseId}
                  onClick={() => setSelectedCase(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-zinc-900 border-cyan-500/50 shadow-lg shadow-cyan-950/20"
                      : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-100">{item.caseId}</span>
                      <span className="text-zinc-500">&middot;</span>
                      <span className="font-mono text-xs text-zinc-300 font-semibold">{item.targetEntity}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        isFreeze
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {item.verdict}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{item.summary}</p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.timestamp ? `${item.timestamp.slice(11, 19)} UTC` : "Recorded"}
                    </span>
                    <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Case Detail Inspector */}
          <div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 sticky top-24 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">{selectedCase.caseId}</h3>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">Target: {selectedCase.targetEntity}</p>
                </div>
                <div
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                    selectedCase.verdict === "FREEZE"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {selectedCase.verdict}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-zinc-400 mb-1">Typology Category</div>
                <div className="text-xs font-mono text-zinc-200 bg-zinc-950/60 p-2 rounded border border-zinc-800">
                  {selectedCase.category}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-zinc-400 mb-1">Investigation Summary</div>
                <p className="text-xs text-zinc-300 bg-zinc-950/60 p-2.5 rounded border border-zinc-800 leading-relaxed">
                  {selectedCase.summary}
                </p>
              </div>

              <div>
                <div className="text-xs font-mono text-zinc-400 mb-1.5">Evidence Nodes in Audit Graph</div>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {selectedCase.evidenceNodes.map((nodeId, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700"
                    >
                      {nodeId}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Memory Persistence:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  agent_memory
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
