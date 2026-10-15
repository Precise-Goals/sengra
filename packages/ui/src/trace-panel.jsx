/**
 * @file packages/ui/src/trace-panel.jsx
 * @description Real-time multi-step investigation trace panel showing executed tools and I/O.
 */

"use client";

import React, { useState } from "react";

/**
 * Formats raw trace records into structured step objects.
 * @param {Array<object>} rawTrace
 */
export function formatTraceSteps(rawTrace = []) {
  return rawTrace.map((step, idx) => ({
    stepNumber: idx + 1,
    toolName: step.tool || "tool",
    timestamp: step.timestamp || new Date().toISOString(),
    inputs: step.inputs || {},
    output: step.output || {},
  }));
}

/**
 * Multi-Step Agent Reasoning Trace Panel Component.
 */
export function TracePanel({ trace = [], onStepClick }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const steps = formatTraceSteps(trace);

  if (steps.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 text-center font-mono text-xs text-zinc-500">
        No active investigation trace recorded.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 font-mono">
      <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest px-1">
        <span>Reasoning Trace</span>
        <span>{steps.length} Steps Executed</span>
      </div>

      <div className="space-y-1.5">
        {steps.map((step, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 transition-all overflow-hidden"
            >
              <button
                type="button"
                onClick={() => {
                  setExpandedIndex(isExpanded ? null : idx);
                  if (onStepClick) onStepClick(step);
                }}
                className="w-full p-2.5 flex items-center justify-between text-left hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {step.toolName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/20">
                    SUCCESS
                  </span>
                  <span>{isExpanded ? "▲" : "▼"}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/40 text-[10px] space-y-2">
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block mb-1">
                      INPUT PARAMETERS:
                    </span>
                    <pre className="p-2 rounded bg-zinc-950 border border-zinc-800/60 text-cyan-300 overflow-x-auto">
                      {JSON.stringify(step.inputs, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block mb-1">
                      TOOL OUTPUT:
                    </span>
                    <pre className="p-2 rounded bg-zinc-950 border border-zinc-800/60 text-zinc-300 overflow-x-auto max-h-36">
                      {JSON.stringify(step.output, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TracePanel;
