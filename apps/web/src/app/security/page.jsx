"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Flame,
  ArrowRight,
  UserX,
  Layers,
  Radio,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import NetworkXGraphVisualizer from "../../components/NetworkXGraphVisualizer";

const SECURITY_GRAPH_DATA = {
  nodes: [
    { id: "CVE-2024-3094", label: "CVE", name: "CVE-2024-3094 (CVSS 10.0)", known_bad: true, tier: 0 },
    { id: "PKG-XZ-UTILS", label: "Device", name: "xz-utils@5.6.0 (Liblzma)", tier: 1 },
    { id: "SVC-AUTH-PORTAL", label: "Device", name: "Auth Portal (SSO Gateway)", tier: 1 },
    { id: "SVC-PAYMENT-CORE", label: "Device", name: "Payment Core Engine", tier: 2 },
    { id: "DB-USER-CREDENTIALS", label: "Address", name: "User DB (Credentials)", tier: 3 },
    { id: "CRED-LEAKED-HASH", label: "IPAddress", name: "Leaked Credential Hashes", tier: 2 },
    { id: "A-TAKEOVER-1", label: "Account", name: "Victim Account 1", flagged: true, tier: 2 },
    { id: "A-TAKEOVER-2", label: "Account", name: "Victim Account 2", flagged: true, tier: 2 },
    { id: "A-TAKEOVER-3", label: "Account", name: "Victim Account 3", flagged: true, tier: 2 },
    { id: "A-TAKEOVER-4", label: "Account", name: "Victim Account 4", flagged: true, tier: 2 },
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

  return (
    <div className="flex-1 flex flex-col bg-[#020408] text-white py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Incident Status Banner */}
      <div className="mb-6 liquid-glass p-5 rounded-2xl border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold font-sans text-white">
              Security Ops · Infrastructure Vulnerability Bridge
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-red-500/20 text-red-400 border border-red-500/40">
              P0 CRITICAL INCIDENT
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans max-w-2xl">
            Correlating upstream Linux SSH backdoor (CVE-2024-3094) directly through compromised authentication portals into live financial account takeovers.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-black/60 p-3 rounded-xl border border-white/[0.06]">
          <div className="text-right">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Containment SLA</div>
            <div className="font-mono text-sm font-bold text-red-400">1 HOUR (P0)</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-left">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Impact Score</div>
            <div className="font-mono text-sm font-bold text-purple-400">98 / 100</div>
          </div>
        </div>
      </div>

      {/* Security Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="liquid-glass p-4 rounded-xl border border-red-500/30">
          <div className="text-xs text-red-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Critical CVE</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">CVE-2024-3094</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">CVSS 10.0 · Liblzma Backdoor</div>
        </div>

        <div className="liquid-glass p-4 rounded-xl border border-purple-500/30">
          <div className="text-xs text-purple-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Compromised Accounts</span>
            <UserX className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">4 Accounts</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Targeted via leaked hash credentials</div>
        </div>

        <div className="liquid-glass p-4 rounded-xl border border-cyan-500/30">
          <div className="text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Downstream Blast Radius</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">7 Assets Reachable</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Payment Core, User DB, Redis Cache</div>
        </div>

        <div className="liquid-glass p-4 rounded-xl border border-emerald-500/30">
          <div className="text-xs text-emerald-400 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Interception Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">CONTAINED</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Zero unauthorized fund dissipation</div>
        </div>
      </section>

      {/* Main Dynamic HTML5 Canvas Physics Graph Visualizer for Security (Full Width) */}
      <div className="w-full h-[580px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl relative mb-6">
        <NetworkXGraphVisualizer
          nodes={SECURITY_GRAPH_DATA.nodes}
          edges={SECURITY_GRAPH_DATA.edges}
          layoutMode="shockwave"
          selectedNodeId={selectedNode?.id}
          onSelectNode={setSelectedNode}
          highlightPath={[
            "CVE-2024-3094",
            "PKG-XZ-UTILS",
            "SVC-AUTH-PORTAL",
            "CRED-LEAKED-HASH",
            "A-TAKEOVER-1",
          ]}
          evidenceSubtitles="Shockwave blast radius: CVE-2024-3094 -> xz-utils -> Auth Portal -> Leaked Credentials -> 4 Compromised Customer Accounts."
        />
      </div>

      {/* Incident Remediation & Automated Mitigation Deck */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="liquid-glass p-5 rounded-2xl border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white mb-2 font-sans">
            1. Autonomous Credential Revocation
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Invalidates all active JWT tokens and sessions issued through the compromised authentication portal.
          </p>
          <button
            type="button"
            onClick={() => setRemediated((prev) => ({ ...prev, credentialsRevoked: true }))}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              remediated.credentialsRevoked
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "neon-button"
            }`}
          >
            {remediated.credentialsRevoked ? "✓ Credentials Revoked" : "Revoke Active Sessions"}
          </button>
        </div>

        <div className="liquid-glass p-5 rounded-2xl border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white mb-2 font-sans">
            2. Rule F4 Autonomous Freeze Gating
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Isolates the 4 compromised accounts and blocks all outgoing payment transfers pending KYC re-verification.
          </p>
          <button
            type="button"
            onClick={() => setRemediated((prev) => ({ ...prev, accountsFrozen: true }))}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              remediated.accountsFrozen
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "neon-button"
            }`}
          >
            {remediated.accountsFrozen ? "✓ 4 Accounts Isolated" : "Execute Gated Freeze"}
          </button>
        </div>

        <div className="liquid-glass p-5 rounded-2xl border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white mb-2 font-sans">
            3. On-Call Incident Pager
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Dispatches automated incident escalation to AppSec Core on-call engineer (<span className="text-white">Alex Chen</span>).
          </p>
          <button
            type="button"
            onClick={() => setRemediated((prev) => ({ ...prev, paged: true }))}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              remediated.paged
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                : "liquid-glass border border-white/20 hover:border-white/40 text-white"
            }`}
          >
            {remediated.paged ? "✓ PagerDuty Alert Dispatched" : "Dispatch On-Call Alert"}
          </button>
        </div>
      </section>
    </div>
  );
}
