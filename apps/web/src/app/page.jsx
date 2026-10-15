"use client";

import React, { useState } from "react";
import {
  GraphCanvas,
  toCytoscapeElements,
  CaseCard,
  TracePanel,
  MetricsBar,
} from "@sengra/ui";

const DEMO_SCENARIOS = {
  ringA: {
    name: "Ring A: Mule Collector Ring",
    badge: "CRITICAL THREAT",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    description: "8 accounts sharing 2 devices, including confirmed fraud device D-17.",
    targetId: "A-RINGA-1",
    flaggedInComponent: 8,
    hopsToBadDevice: 1,
    badDevices: ["D-17"],
    nodes: [
      { id: "A-RINGA-1", label: "Account", name: "Victim Mule 1" },
      { id: "A-RINGA-2", label: "Account", name: "Recruiter Mule" },
      { id: "A-RINGA-COLLECTOR", label: "Account", name: "Collector Mule" },
      { id: "D-17", label: "Device", name: "D-17 (Fraud Rig)", known_bad: true },
      { id: "D-18", label: "Device", name: "D-18 (Mobile)" },
      { id: "IP-MALICIOUS", label: "IPAddress", name: "198.51.100.42" },
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
    name: "Ring B: Benign Family Cluster",
    badge: "BENIGN CANDIDATE",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description: "5 accounts sharing residential address and home Wi-Fi; zero bad devices.",
    targetId: "A-RINGB-1",
    flaggedInComponent: 1,
    hopsToBadDevice: Infinity,
    badDevices: [],
    hasSharedAddress: true,
    hasSharedIp: true,
    hasCircularPayments: false,
    nodes: [
      { id: "A-RINGB-1", label: "Account", name: "Parent (Alice)" },
      { id: "A-RINGB-2", label: "Account", name: "Parent (Bob)" },
      { id: "A-RINGB-3", label: "Account", name: "Child (Charlie)" },
      { id: "ADDR-B-HOME", label: "Address", name: "742 Evergreen Terrace" },
      { id: "IP-HOME-WIFI", label: "IPAddress", name: "192.168.1.1 (Home)" },
    ],
    edges: [
      { source: "A-RINGB-1", target: "ADDR-B-HOME", type: "HAS_ADDRESS" },
      { source: "A-RINGB-2", target: "ADDR-B-HOME", type: "HAS_ADDRESS" },
      { source: "A-RINGB-3", target: "ADDR-B-HOME", type: "HAS_ADDRESS" },
      { source: "A-RINGB-1", target: "IP-HOME-WIFI", type: "CONNECTED_TO" },
      { source: "A-RINGB-2", target: "IP-HOME-WIFI", type: "CONNECTED_TO" },
      { source: "A-RINGB-3", target: "IP-HOME-WIFI", type: "CONNECTED_TO" },
    ],
  },
  ringC: {
    name: "Ring C: Account Takeover Chain",
    badge: "SUSPICIOUS ACCESS",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    description: "Sudden login from high-risk IP with credential stuffing pattern.",
    targetId: "A-RINGC-1",
    flaggedInComponent: 2,
    hopsToBadDevice: 3,
    badDevices: [],
    nodes: [
      { id: "A-RINGC-1", label: "Account", name: "Compromised Account" },
      { id: "DEV-NEW", label: "Device", name: "Unrecognized Device" },
      { id: "IP-VPN", label: "IPAddress", name: "VPN Exit Node" },
      { id: "CARD-ATO", label: "Card", name: "New Card Added" },
    ],
    edges: [
      { source: "A-RINGC-1", target: "DEV-NEW", type: "USED" },
      { source: "DEV-NEW", target: "IP-VPN", type: "CONNECTED_TO" },
      { source: "A-RINGC-1", target: "CARD-ATO", type: "ADDED_PAYMENT" },
    ],
  },
};

export default function DarkOpsConsole() {
  const [activeScenarioKey, setActiveScenarioKey] = useState("ringA");
  const [layoutName, setLayoutName] = useState("concentric");
  const [selectedNode, setSelectedNode] = useState(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [investigationResult, setInvestigationResult] = useState(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState([]);
  const [animatingPath, setAnimatingPath] = useState(null);
  const [activeSubtitle, setActiveSubtitle] = useState(null);

  const currentScenario = DEMO_SCENARIOS[activeScenarioKey];
  const cytoscapeElements = toCytoscapeElements(currentScenario.nodes, currentScenario.edges);

  async function handleRunInvestigation() {
    setIsInvestigating(true);
    setInvestigationResult(null);
    setAnimatingPath(null);
    setActiveSubtitle(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: currentScenario.targetId,
          context: {
            flaggedInComponent: currentScenario.flaggedInComponent,
            hopsToBadDevice: currentScenario.hopsToBadDevice,
            badDevices: currentScenario.badDevices,
            hasSharedAddress: currentScenario.hasSharedAddress,
            hasSharedIp: currentScenario.hasSharedIp,
            hasCircularPayments: currentScenario.hasCircularPayments,
            subgraph: {
              nodes: currentScenario.nodes,
              edges: currentScenario.edges,
            },
          },
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setInvestigationResult(res.data);
        if (res.data.evidencePath && res.data.evidencePath.length > 0) {
          setHighlightedNodeIds(res.data.evidencePath);
          // Trigger animated path traversal
          setAnimatingPath([...res.data.evidencePath]);
        }
      }
    } catch (err) {
      console.error("Investigation failed:", err);
    } finally {
      setIsInvestigating(false);
    }
  }

  function handleReplayAnimation() {
    if (investigationResult?.evidencePath && investigationResult.evidencePath.length > 0) {
      setAnimatingPath(null);
      setTimeout(() => {
        setAnimatingPath([...investigationResult.evidencePath]);
      }, 50);
    }
  }

  function handleSelectScenario(key) {
    setActiveScenarioKey(key);
    setSelectedNode(null);
    setInvestigationResult(null);
    setHighlightedNodeIds([]);
    setAnimatingPath(null);
    setActiveSubtitle(null);
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <h1 className="text-sm font-bold tracking-widest text-zinc-100 font-mono">
            SENGRA <span className="text-zinc-500">//</span> GRAPH FRAUD INTELLIGENCE
          </h1>
          <span className="text-xs px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono">
            SPRINT 3 OPS CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">DB:</span>
            <span className="text-emerald-400">FalkorDB TLS (Active)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">ENGINE:</span>
            <span className="text-purple-400">Claude 3.5 Sonnet + MCP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">POLICY:</span>
            <span className="text-amber-400">Rule F4 Enforced</span>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Rail: Scenarios & Controls */}
        <aside className="w-80 border-r border-zinc-800 bg-zinc-900/60 p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">
              Planted Scenarios
            </h2>
            <div className="flex flex-col gap-2">
              {Object.entries(DEMO_SCENARIOS).map(([key, item]) => {
                const isActive = activeScenarioKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectScenario(key)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      isActive
                        ? "border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                        : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-200">{item.name}</span>
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

          <div className="pt-2 border-t border-zinc-800">
            <h2 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">
              Graph Layout
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {["concentric", "breadthfirst", "circle"].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setLayoutName(name)}
                  className={`text-xs capitalize py-1.5 px-3 rounded border font-mono transition-all ${
                    layoutName === name
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                      : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {investigationResult?.evidencePath && (
            <div className="pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleReplayAnimation}
                className="w-full py-2 px-3 rounded border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono flex items-center justify-center gap-2 transition-all"
              >
                <span>▶ REPLAY PATH ANIMATION</span>
              </button>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleRunInvestigation}
              disabled={isInvestigating}
              className={`w-full py-2.5 px-4 rounded-lg font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                isInvestigating
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-cyan-500/20 active:scale-95"
              }`}
            >
              {isInvestigating ? (
                <>
                  <div className="h-3 w-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  ANALYZING SUBGRAPH...
                </>
              ) : (
                <>
                  <span>TRIGGER INVESTIGATION</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Center: Interactive Cytoscape Canvas & Metrics Bar */}
        <main className="flex-1 flex flex-col relative bg-zinc-950">
          <MetricsBar
            metrics={investigationResult?.metrics}
            nodeCount={currentScenario.nodes.length}
            edgeCount={currentScenario.edges.length}
          />

          {/* Canvas Toolbar & Legend */}
          <div className="absolute top-12 left-4 z-10 flex items-center gap-4 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 backdrop-blur text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              <span className="text-zinc-300">Account</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span className="text-zinc-300">Device</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
              <span className="text-red-400 font-semibold">Bad Device (D-17)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-zinc-300">Address</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-300">Card</span>
            </div>
          </div>

          <div className="flex-1 relative">
            <GraphCanvas
              elements={cytoscapeElements}
              layoutName={layoutName}
              onNodeClick={(data) => setSelectedNode(data)}
              highlightedNodeIds={highlightedNodeIds}
              animatingPath={animatingPath}
              onAnimationStep={(_, subtitle) => setActiveSubtitle(subtitle)}
              onAnimationComplete={() => {
                setTimeout(() => setActiveSubtitle(null), 3000);
              }}
              activeSubtitle={activeSubtitle}
            />
          </div>

          {/* Node Inspector Floating Pill */}
          {selectedNode && (
            <div className="absolute bottom-4 left-4 z-10 max-w-sm p-3 rounded-lg border border-zinc-700 bg-zinc-900/95 backdrop-blur shadow-2xl text-xs font-mono">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
                <span className="font-bold text-cyan-400">{selectedNode.label}: {selectedNode.id}</span>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="text-zinc-500 hover:text-zinc-200"
                >
                  ✕
                </button>
              </div>
              <div className="text-zinc-400 space-y-0.5">
                <div><span className="text-zinc-600">Name:</span> {selectedNode.name || "N/A"}</div>
                <div><span className="text-zinc-600">Threat:</span> {selectedNode.known_bad ? "CONFIRMED MALICIOUS" : "NORMAL"}</div>
              </div>
            </div>
          )}
        </main>

        {/* Right Rail: Structured CaseCard & TracePanel */}
        <aside className="w-96 border-l border-zinc-800 bg-zinc-900/60 p-4 flex flex-col gap-4 overflow-y-auto">
          {investigationResult ? (
            <div className="flex flex-col gap-4">
              <CaseCard
                result={investigationResult}
                onPathSelect={(nodeId) => setSelectedNode({ id: nodeId, label: "Path Step" })}
              />
              <TracePanel
                trace={investigationResult.trace}
                onStepClick={(step) => console.log("Trace step clicked:", step.toolName)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-6 text-zinc-600 font-mono text-xs">
              <div className="h-8 w-8 rounded-full border border-zinc-800 flex items-center justify-center mb-2">
                ?
              </div>
              Select a scenario on the left rail and click "Trigger Investigation" to run multi-step agent reasoning with live animated path traversal.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
