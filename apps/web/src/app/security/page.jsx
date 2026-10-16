"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowRight,
  Server,
  Lock,
  UserX,
  Database,
  Radio,
  CheckCircle2,
  BellRing,
  RefreshCw,
  Layers,
} from "lucide-react";
import { GraphCanvas, toCytoscapeElements } from "@sengra/ui";

const SECURITY_GRAPH_DATA = {
  nodes: [
    { id: "CVE-2024-3094", label: "CVE", name: "CVE-2024-3094 (CVSS 10.0)", severity: "CRITICAL" },
    { id: "PKG-XZ-UTILS", label: "Package", name: "xz-utils@5.6.0" },
    { id: "SVC-AUTH-PORTAL", label: "Service", name: "Auth Portal (SSO Gateway)", tier: "TIER_0" },
    { id: "SVC-PAYMENT-CORE", label: "Service", name: "Payment Core Engine", tier: "TIER_0" },
    { id: "DB-USER-CREDENTIALS", label: "Datastore", name: "User Credential DB (PII)" },
    { id: "CRED-LEAKED-HASH", label: "Credential", name: "Leaked Hashes", compromised: true },
    { id: "A-TAKEOVER-1", label: "Account", name: "Victim Account 1", flagged: true },
    { id: "A-TAKEOVER-2", label: "Account", name: "Victim Account 2", flagged: true },
    { id: "A-TAKEOVER-3", label: "Account", name: "Victim Account 3", flagged: true },
    { id: "A-TAKEOVER-4", label: "Account", name: "Victim Account 4", flagged: true },
  ],
  edges: [
    { source: "PKG-XZ-UTILS", target: "CVE-2024-3094", type: "AFFECTED_BY" },
    { source: "SVC-AUTH-PORTAL", target: "PKG-XZ-UTILS", type: "USES_PACKAGE" },
    { source: "SVC-AUTH-PORTAL", target: "SVC-PAYMENT-CORE", type: "DEPENDS_ON" },
    { source: "SVC-AUTH-PORTAL", target: "DB-USER-CREDENTIALS", type: "READS_FROM" },
    { source: "CRED-LEAKED-HASH", target: "SVC-AUTH-PORTAL", type: "GRANTS_ACCESS_TO" },
    { source: "CRED-LEAKED-HASH", target: "A-TAKEOVER-1", type: "USED_BY" },
    { source: "CRED-LEAKED-HASH", target: "A-TAKEOVER-2", type: "USED_BY" },
    { source: "CRED-LEAKED-HASH", target: "A-TAKEOVER-3", type: "USED_BY" },
    { source: "CRED-LEAKED-HASH", target: "A-TAKEOVER-4", type: "USED_BY" },
  ],
};

export default function SecurityPage() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [remediated, setRemediated] = useState({
    credentialsRevoked: false,
    accountsFrozen: false,
    paged: false,
  });

  const cytoscapeElements = toCytoscapeElements(
    SECURITY_GRAPH_DATA.nodes,
    SECURITY_GRAPH_DATA.edges
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-zinc-100 flex items-center gap-2">
              SENGRA <span className="text-zinc-500">/</span> SECURITY BONUS LAYER
            </h1>
            <p className="text-xs text-zinc-400">
              Cross-Domain Vulnerability &amp; Financial Fraud Bridge Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            P0 INCIDENT ACTIVE
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
            href="/compare"
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
          >
            Benchmark View
          </Link>
          <Link
            href="/memory"
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono transition-colors"
          >
            Memory Explorer
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
        {/* Security Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/40 border border-red-500/30 rounded-xl p-4 relative overflow-hidden">
            <div className="text-xs text-red-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Critical CVE
              <Flame className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">CVE-2024-3094</div>
            <div className="mt-1 text-xs text-zinc-400">CVSS 10.0 · Remote Code Execution</div>
          </div>

          <div className="bg-zinc-900/40 border border-purple-500/30 rounded-xl p-4 relative overflow-hidden">
            <div className="text-xs text-purple-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Compromised Accounts
              <UserX className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">4 Accounts</div>
            <div className="mt-1 text-xs text-zinc-400">Targeted via leaked credential hash</div>
          </div>

          <div className="bg-zinc-900/40 border border-cyan-500/30 rounded-xl p-4 relative overflow-hidden">
            <div className="text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Downstream Blast Radius
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">7 Assets</div>
            <div className="mt-1 text-xs text-zinc-400">Payment Core, User DB, Redis Cache</div>
          </div>

          <div className="bg-zinc-900/40 border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden">
            <div className="text-xs text-emerald-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              Interception Status
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">CONTAINED</div>
            <div className="mt-1 text-xs text-zinc-400">Zero unauthorized transfer exits</div>
          </div>
        </section>

        {/* Interactive Visualizer and Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cytoscape Graph Canvas (2 Columns) */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col h-[560px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
                  Cross-Domain Vulnerability Bridge Graph
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                CVE &rarr; Package &rarr; Service &rarr; Credential &rarr; Fraud Accounts
              </span>
            </div>

            <div className="flex-1 rounded-xl overflow-hidden bg-black/40 border border-zinc-800/80">
              <GraphCanvas
                elements={cytoscapeElements}
                onSelectNode={(node) => setSelectedNode(node)}
                highlightedNodeIds={[
                  "CVE-2024-3094",
                  "PKG-XZ-UTILS",
                  "SVC-AUTH-PORTAL",
                  "CRED-LEAKED-HASH",
                  "A-TAKEOVER-1",
                ]}
              />
            </div>
          </div>

          {/* Right Rail: Findings & Actions */}
          <div className="space-y-4">
            {/* Finding Priority Breakdown */}
            <div className="bg-zinc-900/50 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase">Finding Priority</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  P0 CRITICAL
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-zinc-100">
                Score: 98 <span className="text-xs text-zinc-500 font-sans">/ 100</span>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                Emergency escalation: Internet-exposed authentication gateway affected by CVSS 10.0 backdoor actively exploited to take over 4 accounts.
              </p>

              <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Base CVSS (10.0 &times; 5):</span>
                  <span className="text-zinc-200">50 pts</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Internet Exposure Multiplier:</span>
                  <span className="text-zinc-200">+20 pts</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Customer PII Access:</span>
                  <span className="text-zinc-200">+15 pts</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Active Fraud Linkage:</span>
                  <span>+50 pts</span>
                </div>
              </div>
            </div>

            {/* Incident Escalation Actions */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Automated Incident Mitigation
              </h4>

              <button
                onClick={() => setRemediated((prev) => ({ ...prev, credentialsRevoked: true }))}
                className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                  remediated.credentialsRevoked
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Revoke Leaked Credentials
                </span>
                {remediated.credentialsRevoked ? <CheckCircle2 className="w-4 h-4" /> : <span>Execute</span>}
              </button>

              <button
                onClick={() => setRemediated((prev) => ({ ...prev, accountsFrozen: true }))}
                className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                  remediated.accountsFrozen
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <UserX className="w-3.5 h-3.5" />
                  Freeze 4 Compromised Accounts
                </span>
                {remediated.accountsFrozen ? <CheckCircle2 className="w-4 h-4" /> : <span>Execute</span>}
              </button>

              <button
                onClick={() => setRemediated((prev) => ({ ...prev, paged: true }))}
                className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                  remediated.paged
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <BellRing className="w-3.5 h-3.5" />
                  Page On-Call (@devin.oncall)
                </span>
                {remediated.paged ? <CheckCircle2 className="w-4 h-4" /> : <span>Page</span>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
