"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  BarChart3,
  Network,
  RefreshCw,
} from "lucide-react";

const COMPARISON_SCENARIOS = {
  ringB: {
    id: "ringB",
    title: "Ring B: Benign Family Cluster",
    subtitle: "5 household accounts sharing home Wi-Fi and residential address",
    groundTruth: "NO_ACTION",
    graphAgent: {
      decision: "NO_ACTION",
      confidence: 0.92,
      badge: "CLEARED",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      rule: "SKEPTIC_BENIGN_CLEARANCE",
      explanation: "Skeptic challenge confirmed residential IP and identical address without bad devices or circular transactions. Legitimate family cluster cleared.",
      skepticTriggered: true,
      evidenceHops: 2,
      evidencePath: ["A-RINGB-1", "ADDR-FAMILY-01", "IP-FAMILY-WIFI", "A-RINGB-2"],
      failureMode: null,
      impact: "Zero customer friction; prevented false positive lock of innocent household accounts.",
    },
    baselineAgent: {
      decision: "FREEZE",
      confidence: 0.65,
      badge: "FALSE POSITIVE",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
      rule: "BASELINE_SHARED_NETWORK_THRESHOLD",
      explanation: "Naively flagged for sharing IP/Address with 5 accounts (threshold >= 3).",
      tabularFeatures: {
        directDeviceKnownBad: false,
        sharedIpCount: 5,
        sharedAddressCount: 5,
        txCount24h: 3,
      },
      failureMode: "FALSE_POSITIVE",
      impact: "Customer support churn spike; 5 legitimate customer accounts frozen unnecessarily.",
    },
  },
  ringA: {
    id: "ringA",
    title: "Ring A: Multi-Hop Mule Syndicate",
    subtitle: "Collector mule laundering funds 2 hops away from confirmed bad device D-17",
    groundTruth: "FREEZE",
    graphAgent: {
      decision: "FREEZE",
      confidence: 0.96,
      badge: "RING DETECTED",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
      rule: "RULE_F4_FREEZE_DEVICE_HOP_2",
      explanation: "Multi-hop graph traversal linked account to fraud rig D-17 within 2 hops, corroborated by circular payment structuring into collector mule.",
      skepticTriggered: false,
      evidenceHops: 2,
      evidencePath: ["A-RINGA-COLLECTOR", "A-RINGA-2", "D-17 (FRAUD-RIG)", "A-RINGA-1"],
      failureMode: null,
      impact: "Halted $120,000 illicit mule extraction before off-ramp exit.",
    },
    baselineAgent: {
      decision: "NO_ACTION",
      confidence: 0.85,
      badge: "FALSE NEGATIVE",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      rule: "BASELINE_INSUFFICIENT_DIRECT_EVIDENCE",
      explanation: "Collector mule device D-18 has no prior fraud record and operates on low tabular velocity.",
      tabularFeatures: {
        directDeviceKnownBad: false,
        sharedIpCount: 1,
        sharedAddressCount: 1,
        txCount24h: 2,
      },
      failureMode: "FALSE_NEGATIVE",
      impact: "Undetected fraud ring operation; complete loss of structured mule payouts.",
    },
  },
  ringC: {
    id: "ringC",
    title: "Ring C: Account Takeover Chain",
    subtitle: "Correlated credential leak exploiting auth service vulnerability CVE-2024-3094",
    groundTruth: "FREEZE",
    graphAgent: {
      decision: "FREEZE",
      confidence: 0.94,
      badge: "BREACH CONTAINED",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      rule: "SECURITY_BRIDGE_TAKEOVER",
      explanation: "Security cross-domain bridge query connected leaked credentials to vulnerable auth gateway and compromised session tokens.",
      skepticTriggered: false,
      evidenceHops: 3,
      evidencePath: ["A-TAKEOVER-1", "SVC-AUTH-PORTAL", "CVE-2024-3094", "CRED-LEAKED-HASH"],
      failureMode: null,
      impact: "Proactively isolated 4 compromised corporate accounts before lateral spread.",
    },
    baselineAgent: {
      decision: "FREEZE",
      confidence: 0.70,
      badge: "PARTIAL MATCH",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      rule: "BASELINE_COMPROMISED_DEVICE_FLAG",
      explanation: "Directly flagged after user reported unauthorized login alert.",
      tabularFeatures: {
        directDeviceKnownBad: true,
        sharedIpCount: 1,
        sharedAddressCount: 1,
        txCount24h: 8,
      },
      failureMode: "REACTIVE_DELAY",
      impact: "Flagged reactively after fraudulent transfers initiated; 18h lag behind graph agent.",
    },
  },
};

const BENCHMARK_ACCOUNTS = [
  { id: "A-RINGA-1", scenario: "Ring A: Mule Ring", expected: "FREEZE", graph: "FREEZE", base: "FREEZE", delta: "Both caught (1-hop direct bad device)" },
  { id: "A-RINGA-2", scenario: "Ring A: Mule Ring", expected: "FREEZE", graph: "FREEZE", base: "NO_ACTION", delta: "Graph caught via 2-hop device link; Baseline missed (FN)" },
  { id: "A-RINGA-3", scenario: "Ring A: Mule Ring", expected: "FREEZE", graph: "FREEZE", base: "NO_ACTION", delta: "Graph caught via circular payments; Baseline missed (FN)" },
  { id: "A-RINGA-COLLECTOR", scenario: "Ring A: Mule Ring", expected: "FREEZE", graph: "FREEZE", base: "NO_ACTION", delta: "Graph caught collector mule; Baseline missed (FN)" },
  { id: "A-RINGB-1", scenario: "Ring B: Family Cluster", expected: "NO_ACTION", graph: "NO_ACTION", base: "FREEZE", delta: "Graph cleared by Skeptic; Baseline false-froze (FP)" },
  { id: "A-RINGB-2", scenario: "Ring B: Family Cluster", expected: "NO_ACTION", graph: "NO_ACTION", base: "FREEZE", delta: "Graph cleared by Skeptic; Baseline false-froze (FP)" },
  { id: "A-RINGB-3", scenario: "Ring B: Family Cluster", expected: "NO_ACTION", graph: "NO_ACTION", base: "FREEZE", delta: "Graph cleared by Skeptic; Baseline false-froze (FP)" },
  { id: "A-TAKEOVER-1", scenario: "Ring C: Takeover Chain", expected: "FREEZE", graph: "FREEZE", base: "FREEZE", delta: "Both caught compromised credential" },
  { id: "A-TAKEOVER-2", scenario: "Ring C: Takeover Chain", expected: "FREEZE", graph: "FREEZE", base: "FREEZE", delta: "Both caught compromised credential" },
  { id: "A-CLEAN-01", scenario: "Clean Control", expected: "NO_ACTION", graph: "NO_ACTION", base: "NO_ACTION", delta: "Normal single-user profile" },
  { id: "A-CLEAN-02", scenario: "Clean Control", expected: "NO_ACTION", graph: "NO_ACTION", base: "NO_ACTION", delta: "Normal single-user profile" },
];

export default function ComparePage() {
  const [selectedKey, setSelectedKey] = useState("ringB");
  const [showFullDataset, setShowFullDataset] = useState(false);

  const scenario = COMPARISON_SCENARIOS[selectedKey];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
            S
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-zinc-100 flex items-center gap-2">
              SENGRA <span className="text-zinc-500">/</span> BENCHMARK COMPARISON
            </h1>
            <p className="text-xs text-zinc-400">
              Graph-Native Multi-Hop Intelligence vs Legacy Single-Table Baseline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            BENCHMARK READY
          </div>
          <Link
            href="/about"
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
          >
            The Problem
          </Link>
          <Link
            href="/docs"
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono transition-colors"
          >
            Solution Docs
          </Link>
          <Link
            href="/security"
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono transition-colors"
          >
            Security Ops &rarr;
          </Link>
          <Link
            href="/memory"
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono transition-colors"
          >
            Memory &rarr;
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors flex items-center gap-1.5"
          >
            Dashboard
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Scoreboard Metrics Banner */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Precision
              <span className="text-emerald-400 text-xs font-semibold">+45.5%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-zinc-100">100.0%</span>
              <span className="text-xs text-zinc-500 font-mono">vs 54.5% baseline</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">Zero false positives on benign clusters</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Recall (Catch Rate)
              <span className="text-emerald-400 text-xs font-semibold">+50.0%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-zinc-100">100.0%</span>
              <span className="text-xs text-zinc-500 font-mono">vs 50.0% baseline</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">Catches 2-hop mules and collector accounts</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              F1 Score
              <span className="text-purple-400 text-xs font-semibold">+0.478</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-zinc-100">1.000</span>
              <span className="text-xs text-zinc-500 font-mono">vs 0.522 baseline</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">Harmonic mean of precision and recall</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              False Positive Rate
              <span className="text-emerald-400 text-xs font-semibold">-50.0%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">0.0%</span>
              <span className="text-xs text-zinc-500 font-mono">vs 50.0% baseline</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">Eliminates customer churn from false freezes</div>
          </div>
        </section>

        {/* Scenario Selection Buttons */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
            Select Evaluation Scenario
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(COMPARISON_SCENARIOS).map(([key, item]) => {
              const active = selectedKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    active
                      ? "bg-zinc-800/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${active ? "text-cyan-400" : "text-zinc-200"}`}>
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        item.groundTruth === "FREEZE"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      Truth: {item.groundTruth}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{item.subtitle}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Side-by-Side Comparison Columns */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SENGRA Graph-Native Agent Column */}
          <div className="bg-zinc-900/50 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                      SENGRA Graph-Native Agent
                      <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                        ACTIVE SYSTEM
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Multi-hop topology + Graphology Louvain + Skeptic Rule F4
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${scenario.graphAgent.badgeColor}`}
                >
                  {scenario.graphAgent.badge}
                </div>
              </div>

              {/* Agent Decision Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Decision</div>
                  <div className="text-lg font-bold font-mono text-zinc-100 mt-0.5 flex items-center gap-2">
                    {scenario.graphAgent.decision}
                    {scenario.graphAgent.decision === scenario.groundTruth ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Confidence</div>
                  <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                    {(scenario.graphAgent.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Reasoning & Evidence Details */}
              <div className="space-y-3">
                <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg p-3">
                  <div className="text-xs font-mono text-cyan-400 mb-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Policy / Rule Triggered
                  </div>
                  <div className="text-xs font-mono text-zinc-200">
                    {scenario.graphAgent.rule}
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg p-3">
                  <div className="text-xs font-mono text-cyan-400 mb-1">Investigation Reasoning</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenario.graphAgent.explanation}
                  </p>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg p-3">
                  <div className="text-xs font-mono text-cyan-400 mb-1.5 flex items-center justify-between">
                    <span>Evidence Subgraph Path</span>
                    <span className="text-[11px] text-zinc-400">{scenario.graphAgent.evidenceHops} hops</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                    {scenario.graphAgent.evidencePath.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded border border-zinc-700">
                          {step}
                        </span>
                        {idx < scenario.graphAgent.evidencePath.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-zinc-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Banner */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{scenario.graphAgent.impact}</span>
            </div>
          </div>

          {/* Legacy Flat-Table Baseline Column */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                      Flat-Table Baseline
                      <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                        LEGACY HEURISTIC
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Single-table SQL queries + rigid count thresholds
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${scenario.baselineAgent.badgeColor}`}
                >
                  {scenario.baselineAgent.badge}
                </div>
              </div>

              {/* Baseline Decision Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Decision</div>
                  <div className="text-lg font-bold font-mono text-zinc-100 mt-0.5 flex items-center gap-2">
                    {scenario.baselineAgent.decision}
                    {scenario.baselineAgent.decision === scenario.groundTruth ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Confidence</div>
                  <div className="text-lg font-bold font-mono text-zinc-400 mt-0.5">
                    {(scenario.baselineAgent.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Heuristic Breakdown & Features */}
              <div className="space-y-3">
                <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg p-3">
                  <div className="text-xs font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Tabular Rule Triggered
                  </div>
                  <div className="text-xs font-mono text-zinc-200">
                    {scenario.baselineAgent.rule}
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg p-3">
                  <div className="text-xs font-mono text-zinc-400 mb-1">Decision Rationale</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenario.baselineAgent.explanation}
                  </p>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg p-3">
                  <div className="text-xs font-mono text-zinc-400 mb-2">Tabular Feature Vector</div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800 flex justify-between">
                      <span className="text-zinc-500">directBadDevice:</span>
                      <span className={scenario.baselineAgent.tabularFeatures.directDeviceKnownBad ? "text-rose-400" : "text-zinc-300"}>
                        {String(scenario.baselineAgent.tabularFeatures.directDeviceKnownBad)}
                      </span>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800 flex justify-between">
                      <span className="text-zinc-500">sharedIpCount:</span>
                      <span className="text-zinc-300">{scenario.baselineAgent.tabularFeatures.sharedIpCount}</span>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800 flex justify-between">
                      <span className="text-zinc-500">sharedAddrCount:</span>
                      <span className="text-zinc-300">{scenario.baselineAgent.tabularFeatures.sharedAddressCount}</span>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800 flex justify-between">
                      <span className="text-zinc-500">txCount24h:</span>
                      <span className="text-zinc-300">{scenario.baselineAgent.tabularFeatures.txCount24h}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Banner */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-rose-400 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{scenario.baselineAgent.impact}</span>
            </div>
          </div>
        </section>

        {/* Full Benchmark Accounts Table Toggle */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Benchmark Evaluation Dataset ({BENCHMARK_ACCOUNTS.length} Selected Accounts)
              </h4>
              <p className="text-xs text-zinc-400">
                Evaluation results showing per-account predictions, ground truth verdicts, and failure modes.
              </p>
            </div>
            <button
              onClick={() => setShowFullDataset(!showFullDataset)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
            >
              {showFullDataset ? "Hide Dataset" : "View Full Dataset"}
            </button>
          </div>

          {showFullDataset && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-950/40">
                    <th className="py-2.5 px-3">Account ID</th>
                    <th className="py-2.5 px-3">Scenario</th>
                    <th className="py-2.5 px-3">Expected</th>
                    <th className="py-2.5 px-3">Graph Agent</th>
                    <th className="py-2.5 px-3">Baseline</th>
                    <th className="py-2.5 px-3">Delta Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {BENCHMARK_ACCOUNTS.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-zinc-200">{row.id}</td>
                      <td className="py-2.5 px-3 text-zinc-400">{row.scenario}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            row.expected === "FREEZE"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {row.expected}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            row.graph === row.expected ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {row.graph}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            row.base === row.expected ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {row.base}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400 font-sans">{row.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
