/**
 * @file packages/ui/src/metrics-bar.jsx
 * @description Summary metrics bar displaying graph topological statistics and policy rules.
 */

"use client";

import React from "react";

/**
 * Topological Metrics Bar Component.
 */
export function MetricsBar({ metrics, nodeCount = 0, edgeCount = 0 }) {
  const density = metrics?.density !== undefined ? `${(metrics.density * 100).toFixed(1)}%` : "0.0%";
  const communities = metrics?.componentCount || (metrics?.components?.length) || 1;
  const bridgeCount = metrics?.bridgeNodes?.length || 0;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/40 border-y border-zinc-800/80 font-mono text-xs">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-zinc-500 mr-1.5">NODES:</span>
          <span className="font-bold text-zinc-200">{metrics?.order || nodeCount}</span>
        </div>
        <div>
          <span className="text-zinc-500 mr-1.5">EDGES:</span>
          <span className="font-bold text-zinc-200">{metrics?.size || edgeCount}</span>
        </div>
        <div>
          <span className="text-zinc-500 mr-1.5">DENSITY:</span>
          <span className="font-bold text-cyan-400">{density}</span>
        </div>
        <div>
          <span className="text-zinc-500 mr-1.5">COMMUNITIES:</span>
          <span className="font-bold text-purple-400">{communities}</span>
        </div>
        <div>
          <span className="text-zinc-500 mr-1.5">BRIDGES:</span>
          <span className={`font-bold ${bridgeCount > 0 ? "text-amber-400" : "text-zinc-400"}`}>
            {bridgeCount}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>IN-PROCESS GRAPHOLOGY ENGINE</span>
      </div>
    </div>
  );
}

export default MetricsBar;
