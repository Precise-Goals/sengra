import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Network,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Terminal,
  Activity,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "SENGRA — Graph-Native Financial Crime Intelligence",
  description:
    "Autonomous graph-native fraud investigation agent powered by FalkorDB Cloud, Sarvam AI 105B, and Cytoscape/NetworkX physics.",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#020408] text-white overflow-hidden">
      {/* Background Animated Aurora Glow Mesh */}
      <div className="aurora-mesh">
        <div className="aurora-orb-1" />
        <div className="aurora-orb-2" />
        <div className="aurora-orb-3" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass border border-[#00ff66]/30 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
          <span className="text-xs font-mono text-zinc-300">
            Powered by <strong className="text-[#00ff66]">Sarvam AI (105B)</strong> & <strong className="text-white">FalkorDB Cloud</strong>
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans max-w-5xl mx-auto leading-tight sm:leading-none">
          Autonomous Graph-Native <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#00ff66] neon-text-glow">
            Financial Crime Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto font-sans leading-relaxed">
          Traditional tabular rules fail on multi-hop syndicates and lock innocent customers.
          SENGRA combines <span className="text-white font-medium">graph topology</span>,{" "}
          <span className="text-white font-medium">in-memory Graphology algorithms</span>, and{" "}
          <span className="text-[#00ff66] font-medium">Sarvam 105B agentic reasoning</span> to unmask fraud rings with 100% precision.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl neon-button text-sm font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(0,255,102,0.3)]"
          >
            <span>Launch Forensic Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl liquid-glass border border-white/10 hover:border-[#00ff66]/40 text-sm font-mono text-zinc-200 hover:text-white transition-all flex items-center gap-2"
          >
            <span>The $3.1T Problem</span>
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 rounded-xl liquid-glass border border-white/10 hover:border-white/20 text-sm font-mono text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-[#00ff66]" />
            <span>Architecture & MCP Docs</span>
          </Link>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="liquid-glass-extreme laser-scan-line p-5 rounded-2xl text-left border border-white/[0.08]">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
              Precision Score
            </div>
            <div className="text-3xl font-extrabold text-[#00ff66] font-mono">100.0%</div>
            <div className="text-[11px] text-zinc-400 mt-1 font-mono">
              +45.5% vs Flat-Table Rules
            </div>
          </div>
          <div className="liquid-glass-extreme laser-scan-line p-5 rounded-2xl text-left border border-white/[0.08]">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
              False Positive Rate
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">0.0%</div>
            <div className="text-[11px] text-zinc-400 mt-1 font-mono">
              Skeptic Cleared Family Cluster
            </div>
          </div>
          <div className="liquid-glass-extreme laser-scan-line p-5 rounded-2xl text-left border border-white/[0.08]">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
              Memory Recall SLA
            </div>
            <div className="text-3xl font-extrabold text-[#00ff66] font-mono">&lt; 5ms</div>
            <div className="text-[11px] text-zinc-400 mt-1 font-mono">
              Sub-5ms Associative Citation
            </div>
          </div>
          <div className="liquid-glass-extreme laser-scan-line p-5 rounded-2xl text-left border border-white/[0.08]">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
              Planted Entities
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">~1,500</div>
            <div className="text-[11px] text-zinc-400 mt-1 font-mono">
              Deterministic Synthetics
            </div>
          </div>
        </div>
      </section>

      {/* Four Core Pillars Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#00ff66] mb-2">
            Engine Architecture
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-sans">
            Engineered for High-Stakes Forensic Accuracy
          </h3>
          <p className="mt-4 text-zinc-400 text-sm max-w-2xl mx-auto">
            Traditional fraud engines look at transactions in isolation. SENGRA models financial crime as a dynamic multi-dimensional graph.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="liquid-glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66] mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Multi-Hop Graph Analytics
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                FalkorDB Cloud subgraphs paired with Graphology in-memory Louvain modularity, betweenness centrality, and weakly connected components.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#00ff66]">
              O(1) Indexed Traversal &rarr;
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="liquid-glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66] mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Sarvam 105B Reasoning
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Large language models equipped with 15 MCP tools to orchestrate entity recalls, skeptic challenges, and forensic explanations in plain English.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#00ff66]">
              Sarvam AI Integration &rarr;
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="liquid-glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66] mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Rule F4 Freeze Gating
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Guaranteed freeze safety: actions require &gt;=3 flagged accounts and &lt;=2 hops to known-bad devices. Includes Skeptic challenge to prevent false customer locks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#00ff66]">
              Deterministic Policy &rarr;
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="liquid-glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66] mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Cross-Domain CVE Bridge
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bridges infrastructure vulnerabilities (CVE-2024-3094 SSH backdoor) to stolen credentials, compromised accounts, and automated P0 critical prioritization.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#00ff66]">
              Security Bonus Layer &rarr;
            </div>
          </div>
        </div>
      </section>

      {/* Planted Fraud Syndicates Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00ff66]">
              Empirical Benchmarks
            </span>
            <h3 className="text-3xl font-bold font-sans mt-2">
              Planted Benchmark Syndicates
            </h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              Inspect how the graph engine handles circular layering, benign family clusters, and structuring smurfing rings.
            </p>
          </div>
          <Link
            href="/compare"
            className="px-4 py-2 rounded-lg liquid-glass border border-white/10 hover:border-[#00ff66]/40 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            View Full Benchmark Matrix &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ring A */}
          <div className="liquid-glass p-6 rounded-2xl border border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-red-400 uppercase">
                Ring A · Mule Syndicate
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-mono border border-red-500/30">
                CRITICAL
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">8-Account Collector Ring</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Victim mules transferring structured sums into a collector account connected to known-bad fraud device D-17.
            </p>
            <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11px] text-zinc-300">
              <div className="text-red-400 font-bold mb-1">Graph Verdict: FREEZE</div>
              <div>Confidence: 95% · Gated Freeze Approved</div>
            </div>
          </div>

          {/* Ring B */}
          <div className="liquid-glass p-6 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Ring B · Benign Household
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                CLEARED
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">5-Member Family Cluster</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Innocent family members sharing home Wi-Fi and residential address. Flat rules lock them; Skeptic clears them.
            </p>
            <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11px] text-zinc-300">
              <div className="text-[#00ff66] font-bold mb-1">Graph Verdict: NO_ACTION</div>
              <div>Confidence: 92% · Zero Customer Friction</div>
            </div>
          </div>

          {/* Ring C */}
          <div className="liquid-glass p-6 rounded-2xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                Ring C · Smurfing Ring
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono border border-amber-500/30">
                AML ALERT
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Structuring Below Threshold</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              4 feeder accounts executing fan-in payments under $10,000 reporting limits into a centralized funnel account.
            </p>
            <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11px] text-zinc-300">
              <div className="text-amber-400 font-bold mb-1">Graph Verdict: HOLD_REVIEW</div>
              <div>Confidence: 89% · Fan-In Unmasked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="liquid-glass-neon p-10 sm:p-14 rounded-3xl text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
              Experience the Full Visual Forensic Workbench
            </h3>
            <p className="mt-4 text-zinc-300 text-sm leading-relaxed">
              Open the interactive canvas powered by HTML5 physics, run live scenarios, inspect animated money laundering paths, and converse with the Sarvam 105B copilot.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-xl neon-button text-sm font-mono font-bold"
              >
                Launch Dashboard Console &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
