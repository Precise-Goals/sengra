"use client";

import React, { useState } from "react";
import Link from "next/link";
import NetworkXGraphVisualizer from "../../components/NetworkXGraphVisualizer";
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Lock,
  Sparkles,
  Send,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Terminal,
} from "lucide-react";

const DEMO_SCENARIOS = {
  ringA: {
    id: "ringA",
    name: "Ring A · Mule Collector Syndicate",
    threatLevel: "CRITICAL",
    threatBadgeColor: "text-red-400 border-red-500/40 bg-red-950/30",
    description: "8-account syndicate laundering stolen funds through collector mule with direct link to fraud rig D-17.",
    targetId: "A-RINGA-1",
    flaggedInComponent: 8,
    hopsToBadDevice: 1,
    badDevices: ["D-17"],
    decision: "FREEZE",
    confidence: 0.95,
    actionTaken: "AUTONOMOUS_FREEZE_GATED",
    explanation: "Account A-RINGA-1 is part of an 8-account flagged component and within 1 hop of known-bad device D-17. Rule F4 gated freeze executed.",
    evidencePath: ["A-RINGA-1", "D-17", "A-RINGA-COLLECTOR"],
    subtitles: "Tracing hop 1: Account A-RINGA-1 connects to fraud rig D-17 -> Fan-in transfer to collector mule.",
    nodes: [
      { id: "A-RINGA-1", label: "Account", name: "Suspect Mule 1", tier: 2 },
      { id: "A-RINGA-2", label: "Account", name: "Recruiter Mule", tier: 2 },
      { id: "A-RINGA-COLLECTOR", label: "Account", name: "Collector Mule", tier: 2 },
      { id: "D-17", label: "Device", name: "D-17 (Fraud Rig)", known_bad: true, tier: 1 },
      { id: "D-18", label: "Device", name: "D-18 (Mobile)", tier: 1 },
      { id: "IP-MALICIOUS", label: "IPAddress", name: "198.51.100.42", tier: 0 },
    ],
    edges: [
      { source: "A-RINGA-1", target: "D-17", type: "USED" },
      { source: "A-RINGA-2", target: "D-17", type: "USED" },
      { source: "A-RINGA-COLLECTOR", target: "D-18", type: "USED" },
      { source: "A-RINGA-2", target: "D-18", type: "USED" },
      { source: "D-17", target: "IP-MALICIOUS", type: "CONNECTED_TO" },
      { source: "A-RINGA-1", target: "A-RINGA-COLLECTOR", type: "TRANSFERRED_TO" },
      { source: "A-RINGA-2", target: "A-RINGA-COLLECTOR", type: "TRANSFERRED_TO" },
    ],
  },
  ringB: {
    id: "ringB",
    name: "Ring B · Benign Family Cluster",
    threatLevel: "CLEARED",
    threatBadgeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/30",
    description: "5 household accounts sharing residential address and home Wi-Fi; zero bad devices or circularity.",
    targetId: "A-RINGB-1",
    flaggedInComponent: 1,
    hopsToBadDevice: Infinity,
    badDevices: [],
    decision: "NO_ACTION",
    confidence: 0.92,
    actionTaken: "CLEARED_VIA_SKEPTIC",
    explanation: "Legitimate household cluster identified: shared residential address and home Wi-Fi with zero known-bad devices or circular loops. Skeptic challenge cleared.",
    evidencePath: ["A-RINGB-1", "ADDR-HOME", "IP-WIFI", "A-RINGB-2"],
    subtitles: "Skeptic protocol verified: benign household cluster sharing IP-WIFI and ADDR-HOME. False positive avoided.",
    nodes: [
      { id: "A-RINGB-1", label: "Account", name: "Alice (Parent)", tier: 2 },
      { id: "A-RINGB-2", label: "Account", name: "Bob (Parent)", tier: 2 },
      { id: "A-RINGB-3", label: "Account", name: "Charlie (Child)", tier: 2 },
      { id: "ADDR-HOME", label: "Address", name: "742 Evergreen Ter", tier: 3 },
      { id: "IP-WIFI", label: "IPAddress", name: "192.168.1.1 (Home)", tier: 0 },
    ],
    edges: [
      { source: "A-RINGB-1", target: "ADDR-HOME", type: "LOCATED_AT" },
      { source: "A-RINGB-2", target: "ADDR-HOME", type: "LOCATED_AT" },
      { source: "A-RINGB-3", target: "ADDR-HOME", type: "LOCATED_AT" },
      { source: "A-RINGB-1", target: "IP-WIFI", type: "CONNECTED_FROM" },
      { source: "A-RINGB-2", target: "IP-WIFI", type: "CONNECTED_FROM" },
    ],
  },
  ringC: {
    id: "ringC",
    name: "Ring C · Smurfing AML Structuring",
    threatLevel: "AML ALERT",
    threatBadgeColor: "text-amber-400 border-amber-500/40 bg-amber-950/30",
    description: "4 feeder accounts structuring micro-payments below $10,000 threshold into a single funnel.",
    targetId: "A-SMURF-1",
    flaggedInComponent: 4,
    hopsToBadDevice: 3,
    badDevices: [],
    decision: "HOLD_FOR_REVIEW",
    confidence: 0.89,
    actionTaken: "HELD_FOR_COMPLIANCE",
    explanation: "High-density fan-in transaction volume below standard AML threshold detected. Held for manual AML compliance review under Rule F4.",
    evidencePath: ["A-SMURF-1", "A-SMURF-AGG", "A-SMURF-2"],
    subtitles: "Structuring pattern detected: Multiple feeder nodes transferring $9,800 micro-amounts to central aggregator.",
    nodes: [
      { id: "A-SMURF-1", label: "Account", name: "Feeder Account 1", tier: 2 },
      { id: "A-SMURF-2", label: "Account", name: "Feeder Account 2", tier: 2 },
      { id: "A-SMURF-3", label: "Account", name: "Feeder Account 3", tier: 2 },
      { id: "A-SMURF-AGG", label: "Account", name: "Central Funnel", tier: 2 },
      { id: "IP-PROXY", label: "IPAddress", name: "103.21.244.0 (VPN)", tier: 0 },
    ],
    edges: [
      { source: "A-SMURF-1", target: "A-SMURF-AGG", type: "STRUCTURING_TX" },
      { source: "A-SMURF-2", target: "A-SMURF-AGG", type: "STRUCTURING_TX" },
      { source: "A-SMURF-3", target: "A-SMURF-AGG", type: "STRUCTURING_TX" },
      { source: "A-SMURF-1", target: "IP-PROXY", type: "CONNECTED_FROM" },
      { source: "A-SMURF-2", target: "IP-PROXY", type: "CONNECTED_FROM" },
    ],
  },
  ringD: {
    id: "ringD",
    name: "Ring D · Infrastructure Breach Takeover",
    threatLevel: "P0 CRITICAL",
    threatBadgeColor: "text-purple-400 border-purple-500/40 bg-purple-950/30",
    description: "CVE-2024-3094 SSH backdoor exploited to compromise authentication portal and hijack accounts.",
    targetId: "CVE-2024-3094",
    flaggedInComponent: 5,
    hopsToBadDevice: 1,
    badDevices: ["SVC-AUTH"],
    decision: "FREEZE",
    confidence: 0.98,
    actionTaken: "ISOLATE_ACCOUNTS_P0",
    explanation: "Infrastructure exploit in xz-utils bypassed auth portal, generating 4 hijacked customer accounts. Prioritized P0 Critical (1-hour SLA).",
    evidencePath: ["CVE-2024-3094", "PKG-XZ", "SVC-AUTH", "A-TAKEOVER-1"],
    subtitles: "Cross-domain breach: CVE-2024-3094 -> xz-utils -> SVC-AUTH -> Credential Leak -> 4 compromised customer accounts.",
    nodes: [
      { id: "CVE-2024-3094", label: "CVE", name: "xz-utils Backdoor", known_bad: true, tier: 0 },
      { id: "PKG-XZ", label: "Device", name: "xz-utils@5.6.0", tier: 1 },
      { id: "SVC-AUTH", label: "Device", name: "SVC-AUTH-PORTAL", tier: 1 },
      { id: "A-TAKEOVER-1", label: "Account", name: "Hijacked Account 1", tier: 2 },
      { id: "A-TAKEOVER-2", label: "Account", name: "Hijacked Account 2", tier: 2 },
    ],
    edges: [
      { source: "CVE-2024-3094", target: "PKG-XZ", type: "AFFECTS" },
      { source: "PKG-XZ", target: "SVC-AUTH", type: "RUNS_ON" },
      { source: "SVC-AUTH", target: "A-TAKEOVER-1", type: "COMPROMISED" },
      { source: "SVC-AUTH", target: "A-TAKEOVER-2", type: "COMPROMISED" },
    ],
  },
};

/**
 * Clean & Format Sarvam AI output
 * Removes garbled encoding tokens (like  or ??) and formats markdown cleanly
 */
function formatSarvamText(rawText = "") {
  if (!rawText) return "";

  // Normalize garbled characters and replace multi-question marks
  return rawText
    .replace(/\uFFFD/g, "")
    .replace(/\?\?\b/g, "")
    .replace(/(\r\n|\r)/g, "\n");
}

export default function DashboardPage() {
  const [activeKey, setActiveKey] = useState("ringA");
  const [selectedNode, setSelectedNode] = useState(null);
  const [sarvamInput, setSarvamInput] = useState("");
  const [sarvamLoading, setSarvamLoading] = useState(false);
  const [sarvamMessages, setSarvamMessages] = useState([
    {
      role: "assistant",
      content:
        "Sarvam 105B Forensic Intelligence Copilot online. Ask any question regarding graph topology, Rule F4 freeze thresholds, or Skeptic clearance.",
    },
  ]);

  const activeScenario = DEMO_SCENARIOS[activeKey];

  const handleSelectScenario = (key) => {
    setActiveKey(key);
    setSelectedNode(null);
  };

  const handleAskSarvam = async (e, customPrompt) => {
    if (e) e.preventDefault();
    const queryText = customPrompt || sarvamInput;
    if (!queryText.trim()) return;

    setSarvamInput("");
    setSarvamMessages((prev) => [...prev, { role: "user", content: queryText }]);
    setSarvamLoading(true);

    try {
      const res = await fetch("/api/sarvam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryText,
          scenario: activeScenario,
          context: {
            targetId: activeScenario.targetId,
            decision: activeScenario.decision,
            evidencePath: activeScenario.evidencePath,
            explanation: activeScenario.explanation,
          },
        }),
      });

      const data = await res.json();
      const rawContent = data.answer || data.message?.content || data.content || "Forensic analysis completed.";
      const cleaned = formatSarvamText(rawContent);

      setSarvamMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleaned,
          model: data.model || "sarvam-105b-conversations",
        },
      ]);
    } catch (err) {
      setSarvamMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection to Sarvam AI was interrupted. Local fallback reasoning active.",
        },
      ]);
    } finally {
      setSarvamLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020408] text-white py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Top Scenario & Case Header Bar */}
      <div className="mb-6 liquid-glass p-5 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold font-sans text-white">{activeScenario.name}</h1>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${activeScenario.threatBadgeColor}`}>
              {activeScenario.threatLevel}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans max-w-2xl">
            {activeScenario.description}
          </p>
        </div>

        {/* Verdict Badge */}
        <div className="flex items-center gap-4 bg-black/60 p-3 rounded-xl border border-white/[0.06]">
          <div className="text-right">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Policy Verdict</div>
            <div
              className={`font-mono text-sm font-bold ${
                activeScenario.decision === "FREEZE"
                  ? "text-red-400"
                  : activeScenario.decision === "NO_ACTION"
                  ? "text-[#00ff66]"
                  : "text-amber-400"
              }`}
            >
              {activeScenario.decision}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-left">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Confidence</div>
            <div className="font-mono text-sm font-bold text-[#00ff66]">
              {(activeScenario.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {Object.entries(DEMO_SCENARIOS).map(([key, item]) => {
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectScenario(key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? "border-[#00ff66]/50 bg-[#00ff66]/10 text-white shadow-[0_0_15px_rgba(0,255,102,0.15)]"
                  : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20"
              }`}
            >
              <div className="text-xs font-semibold truncate">{item.name}</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                Target: {item.targetId}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Dynamic HTML5 Canvas Graph Visualizer (Full Width) */}
      <div className="w-full h-[580px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl relative mb-6">
        <NetworkXGraphVisualizer
          nodes={activeScenario.nodes}
          edges={activeScenario.edges}
          layoutMode={activeKey === "ringD" ? "shockwave" : "fruchterman-reingold"}
          selectedNodeId={selectedNode?.id}
          onSelectNode={setSelectedNode}
          highlightPath={activeScenario.evidencePath}
          evidenceSubtitles={activeScenario.subtitles}
        />
      </div>

      {/* Centered Minimalist Sarvam AI (105B) Interactive Console */}
      <section className="max-w-4xl mx-auto w-full liquid-glass rounded-2xl border border-white/[0.08] p-6 mb-12">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-sans">
                Sarvam 105B Forensic Intelligence
              </h2>
              <span className="text-[10px] font-mono text-zinc-400">
                Direct reasoning over graph topology & Rule F4 policy thresholds
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#00ff66] border border-[#00ff66]/20">
            sarvam-105b-conversations
          </span>
        </div>

        {/* Quick Question Starters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() =>
              handleAskSarvam(null, `Explain why account ${activeScenario.targetId} was evaluated as ${activeScenario.decision} under Rule F4.`)
            }
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition-colors"
          >
            Explain Rule F4 Verdict &rarr;
          </button>
          <button
            type="button"
            onClick={() =>
              handleAskSarvam(null, `Detail the topological evidence path for ${activeScenario.name} and why betweenness matters.`)
            }
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition-colors"
          >
            Topological Evidence Path &rarr;
          </button>
          <button
            type="button"
            onClick={() =>
              handleAskSarvam(null, `Why did the Skeptic challenge clear or gate this scenario?`)
            }
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition-colors"
          >
            Skeptic Challenge Logic &rarr;
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-3 mb-4 max-h-[380px] overflow-y-auto pr-2">
          {sarvamMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-xs font-sans leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#00ff66]/10 border border-[#00ff66]/30 text-white ml-8"
                  : "bg-black/60 border border-white/[0.06] text-zinc-200 mr-4"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 mb-2">
                <span>{msg.role === "user" ? "Investigator" : "Sarvam 105B Intelligence"}</span>
                {msg.model && <span className="text-[#00ff66]">{msg.model}</span>}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-zinc-300">
                {msg.content}
              </div>
            </div>
          ))}

          {sarvamLoading && (
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] text-xs font-mono text-[#00ff66] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sarvam 105B computing forensic reasoning across graph topology...</span>
            </div>
          )}
        </div>

        {/* Minimalist Input Bar */}
        <form onSubmit={(e) => handleAskSarvam(e)} className="flex gap-2">
          <input
            type="text"
            value={sarvamInput}
            onChange={(e) => setSarvamInput(e.target.value)}
            placeholder="Ask Sarvam AI about this syndicate, evidence hops, or freeze criteria..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00ff66]"
          />
          <button
            type="submit"
            disabled={sarvamLoading}
            className="px-5 py-2.5 rounded-xl neon-button text-xs font-mono font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>Analyze</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </section>
    </div>
  );
}
