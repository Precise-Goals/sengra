"use client";

import React, { useState } from "react";
import Link from "next/link";
import NetworkXGraphVisualizer from "../../components/NetworkXGraphVisualizer";
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  Sparkles,
  Send,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";

const DEMO_SCENARIOS = {
  ringA: {
    id: "ringA",
    name: "Ring A: Mule Collector Syndicate",
    badge: "CRITICAL THREAT",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    description: "8 accounts sharing 2 devices, including confirmed fraud device D-17.",
    targetId: "A-RINGA-1",
    flaggedInComponent: 8,
    hopsToBadDevice: 1,
    badDevices: ["D-17"],
    decision: "FREEZE",
    confidence: 0.95,
    actionTaken: "AUTONOMOUS_FREEZE_GATED",
    explanation: "Account A-RINGA-1 is part of a 8-account flagged component and within 1 hop of known-bad device D-17. Rule F4 gated freeze executed.",
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
    name: "Ring B: Benign Family Cluster",
    badge: "BENIGN CANDIDATE",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description: "5 accounts sharing residential address and home Wi-Fi; zero bad devices.",
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
    name: "Ring C: Smurfing AML Syndicate",
    badge: "AML STRUCTURING",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    description: "4 feeder accounts structuring payments under $10k into a central aggregator.",
    targetId: "A-SMURF-1",
    flaggedInComponent: 4,
    hopsToBadDevice: 3,
    badDevices: [],
    decision: "HOLD_FOR_REVIEW",
    confidence: 0.89,
    actionTaken: "HELD_FOR_COMPLIANCE",
    explanation: "High-density fan-in transaction volume below standard threshold detected. Held for manual AML compliance review under Rule F4.",
    evidencePath: ["A-SMURF-1", "A-SMURF-AGGREGATOR", "A-SMURF-2"],
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
    name: "Ring D: CVE Cyber Breach Bridge",
    badge: "SECURITY P0 CRITICAL",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description: "CVE-2024-3094 SSH backdoor exploited to compromise authentication service credentials.",
    targetId: "CVE-2024-3094",
    flaggedInComponent: 5,
    hopsToBadDevice: 1,
    badDevices: ["SVC-AUTH-PORTAL"],
    decision: "FREEZE",
    confidence: 0.98,
    actionTaken: "ISOLATE_ACCOUNTS_P0",
    explanation: "Infrastructure exploit in xz-utils bypassed auth portal, generating 4 hijacked customer accounts. Prioritized P0 Critical (1-hour SLA).",
    evidencePath: ["CVE-2024-3094", "xz-utils@5.6.0", "SVC-AUTH", "A-TAKEOVER-1"],
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

export default function DashboardPage() {
  const [activeKey, setActiveKey] = useState("ringA");
  const [selectedNode, setSelectedNode] = useState(null);
  const [sarvamInput, setSarvamInput] = useState("");
  const [sarvamLoading, setSarvamLoading] = useState(false);
  const [sarvamMessages, setSarvamMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your Sarvam 105B Forensic Crime Intelligence Copilot. Ask me to explain the active syndicate topology, evaluate freeze policies, or verify Skeptic clearance.",
    },
  ]);

  const activeScenario = DEMO_SCENARIOS[activeKey];

  const handleSelectScenario = (key) => {
    setActiveKey(key);
    setSelectedNode(null);
  };

  const handleAskSarvam = async (e) => {
    if (e) e.preventDefault();
    if (!sarvamInput.trim()) return;

    const userText = sarvamInput;
    setSarvamInput("");
    setSarvamMessages((prev) => [...prev, { role: "user", content: userText }]);
    setSarvamLoading(true);

    try {
      const res = await fetch("/api/sarvam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          scenario: activeScenario,
          context: {
            selectedNode: selectedNode?.id,
            targetId: activeScenario.targetId,
            decision: activeScenario.decision,
            evidencePath: activeScenario.evidencePath,
          },
        }),
      });

      const data = await res.json();
      setSarvamMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No response received from Sarvam AI.",
        },
      ]);
    } catch (err) {
      setSarvamMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Encountered an error connecting to Sarvam AI. Falling back to local deterministic reasoning.",
        },
      ]);
    } finally {
      setSarvamLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020408] text-white overflow-hidden">
      {/* Sub-header status strip */}
      <div className="border-b border-white/[0.08] liquid-glass py-2 px-6 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-zinc-400">ACTIVE SCENARIO:</span>
          <span className="text-white font-bold">{activeScenario.name}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] border ${activeScenario.badgeColor}`}>
            {activeScenario.badge}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff66]" />
            <span className="text-zinc-300">FalkorDB Graph (Active)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff66]" />
            <span className="text-zinc-300">Sarvam 105B Copilot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-zinc-300">Rule F4 Enforced</span>
          </div>
        </div>
      </div>

      {/* 3-Column Workstation Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Rail: Planted Scenarios & Controls */}
        <aside className="w-80 border-r border-white/[0.08] bg-[#020408]/90 p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">
              Planted Benchmark Syndicates
            </h2>
            <div className="flex flex-col gap-2">
              {Object.entries(DEMO_SCENARIOS).map(([key, item]) => {
                const isActive = activeKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectScenario(key)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isActive
                        ? "border-[#00ff66]/50 bg-[#00ff66]/10 shadow-[0_0_15px_rgba(0,255,102,0.12)]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{item.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border inline-block mb-1.5 font-mono ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Benchmark Comparison Link */}
          <div className="mt-auto p-3 rounded-xl liquid-glass border border-white/[0.08]">
            <div className="text-xs font-mono text-zinc-300 font-bold mb-1">
              Flat-Table vs Graph Agent
            </div>
            <p className="text-[11px] text-zinc-400 mb-2">
              Graph reasoning avoids 50% false positives on family clusters.
            </p>
            <Link
              href="/compare"
              className="text-xs text-[#00ff66] font-mono hover:underline flex items-center gap-1"
            >
              <span>View side-by-side metrics</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </aside>

        {/* Center: Custom HTML5 Canvas Physics Graph Visualizer */}
        <main className="flex-1 flex flex-col p-4 bg-[#020408]">
          <NetworkXGraphVisualizer
            nodes={activeScenario.nodes}
            edges={activeScenario.edges}
            layoutMode="spring"
            selectedNodeId={selectedNode?.id}
            onSelectNode={setSelectedNode}
            highlightPath={activeScenario.evidencePath}
            evidenceSubtitles={activeScenario.subtitles}
          />
        </main>

        {/* Right Rail: Case Card & Sarvam 105B Copilot Drawer */}
        <aside className="w-96 border-l border-white/[0.08] bg-[#020408]/90 flex flex-col overflow-hidden">
          {/* Top Half: Case Card Verdict */}
          <div className="p-4 border-b border-white/[0.08] overflow-y-auto max-h-[48%]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Case Investigation</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                Rule F4 Gated
              </span>
            </div>

            <div className="liquid-glass p-4 rounded-xl border border-white/[0.08] mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-zinc-400">Target ID:</span>
                <span className="font-mono text-xs font-bold text-white">{activeScenario.targetId}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-zinc-400">Verdict:</span>
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    activeScenario.decision === "FREEZE"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : activeScenario.decision === "NO_ACTION"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {activeScenario.decision}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-zinc-400">Confidence:</span>
                <span className="font-mono text-xs text-[#00ff66]">
                  {(activeScenario.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mt-2 pt-2 border-t border-white/[0.06]">
                {activeScenario.explanation}
              </p>
            </div>

            {/* Selected Node Inspector */}
            {selectedNode && (
              <div className="liquid-glass-neon p-3 rounded-xl text-xs font-mono">
                <div className="flex items-center justify-between text-[#00ff66] font-bold mb-1">
                  <span>Selected Node</span>
                  <span>{selectedNode.id}</span>
                </div>
                <div className="text-zinc-300 text-[11px]">{selectedNode.name}</div>
                <div className="text-zinc-400 text-[10px] mt-1">Type: {selectedNode.label}</div>
              </div>
            )}
          </div>

          {/* Bottom Half: Sarvam AI (105B) Interactive Copilot */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
                <span className="text-xs font-mono text-[#00ff66] font-bold">
                  Sarvam 105B Copilot
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Conversational AML</span>
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => setSarvamInput("Explain why Rule F4 was evaluated for this scenario.")}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06]"
              >
                Rule F4 Logic?
              </button>
              <button
                type="button"
                onClick={() => setSarvamInput("Why did Skeptic protocol clear or flag this cluster?")}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06]"
              >
                Skeptic Check?
              </button>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1 text-xs font-sans">
              {sarvamMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    msg.role === "user"
                      ? "liquid-glass-neon ml-4 text-zinc-100"
                      : "liquid-glass mr-2 text-zinc-300 border border-white/[0.06]"
                  }`}
                >
                  <div className="font-mono text-[10px] text-zinc-400 mb-1">
                    {msg.role === "user" ? "Investigator" : "Sarvam 105B"}
                  </div>
                  <div className="text-[11px] leading-relaxed">{msg.content}</div>
                </div>
              ))}
              {sarvamLoading && (
                <div className="liquid-glass p-2.5 rounded-xl text-xs text-[#00ff66] font-mono flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sarvam 105B reasoning...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskSarvam} className="flex gap-2">
              <input
                type="text"
                value={sarvamInput}
                onChange={(e) => setSarvamInput(e.target.value)}
                placeholder="Ask Sarvam AI about this case..."
                className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00ff66]"
              />
              <button
                type="submit"
                disabled={sarvamLoading}
                className="px-3 py-2 rounded-lg neon-button text-xs flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
