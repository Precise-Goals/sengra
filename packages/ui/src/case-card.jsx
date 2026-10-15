/**
 * @file packages/ui/src/case-card.jsx
 * @description Structured decision report card component with evidence traversal path.
 */

"use client";

import React from "react";

/**
 * Returns styling classes based on policy verdict.
 * @param {string} verdict - "FREEZE" | "HOLD" | "NO_ACTION"
 */
export function getVerdictStyle(verdict) {
  switch (verdict) {
    case "FREEZE":
      return {
        badge: "bg-red-500/20 text-red-400 border-red-500/40",
        border: "border-red-500/40 bg-red-950/20",
        text: "text-red-400",
        glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]",
      };
    case "NO_ACTION":
      return {
        badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
        border: "border-emerald-500/40 bg-emerald-950/20",
        text: "text-emerald-400",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]",
      };
    case "HOLD":
    default:
      return {
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
        border: "border-amber-500/40 bg-amber-950/20",
        text: "text-amber-400",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
      };
  }
}

/**
 * Case Decision Report Card Component.
 */
export function CaseCard({ result, onPathSelect }) {
  if (!result) return null;

  const verdict = result.decision || "HOLD";
  const style = getVerdictStyle(verdict);
  const confidencePct = Math.round((result.confidence || 0) * 100);
  const evidencePath = result.evidencePath || [];

  return (
    <div className={`p-4 rounded-xl border ${style.border} ${style.glow} flex flex-col gap-3 font-mono transition-all`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest uppercase text-zinc-400">
            AUDIT RECORD
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.badge}`}>
            {verdict}
          </span>
        </div>
        <div className="text-xs font-bold text-zinc-300">
          CONFIDENCE: <span className={style.text}>{confidencePct}%</span>
        </div>
      </div>

      {/* Main Verdict & Target */}
      <div>
        <div className="text-[11px] text-zinc-500 uppercase tracking-wider">
          TARGET EVALUATED
        </div>
        <div className="text-base font-black text-zinc-100 flex items-center gap-2">
          {result.accountId || "UNKNOWN"}
          {result.skepticCleared && (
            <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SKEPTIC CLEARED
            </span>
          )}
        </div>
      </div>

      {/* Human-Readable Explanation */}
      <div className="text-xs text-zinc-300 font-sans leading-relaxed bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/60">
        {result.explanation || "No policy justification recorded."}
      </div>

      {/* Evidence Traversal Path */}
      {evidencePath.length > 0 && (
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">
            EVIDENCE GRAPH PATH ({evidencePath.length} hops)
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {evidencePath.map((nodeId, idx) => (
              <React.Fragment key={idx}>
                <button
                  type="button"
                  onClick={() => onPathSelect && onPathSelect(nodeId)}
                  className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-[11px] text-cyan-300 border border-zinc-700 transition-colors"
                >
                  {nodeId}
                </button>
                {idx < evidencePath.length - 1 && (
                  <span className="text-zinc-600 text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseCard;
