import Link from "next/link";
import {
  AlertTriangle,
  ShieldX,
  TrendingDown,
  Layers,
  Network,
  Users,
  Search,
  CheckCircle,
  ArrowRight,
  Flame,
  Activity,
} from "lucide-react";

export const metadata = {
  title: "The Problem — SENGRA Crime Intelligence",
  description:
    "Why traditional tabular rules fail to detect modern financial fraud syndicates and generate massive false positive customer locks.",
};

export default function AboutProblemPage() {
  return (
    <div className="relative min-h-screen bg-[#020408] text-white py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-red-400 inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
          The Financial Crime Crisis
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-sans tracking-tight leading-tight">
          Why Traditional Fraud Engines Fail
        </h1>
        <p className="mt-4 text-base text-zinc-400 font-sans leading-relaxed">
          Over <strong className="text-white">$3.1 Trillion</strong> in illicit funds are laundered through financial institutions each year. Legacy fraud tools rely on tabular databases, relational joins, and naive heuristics—missing coordinated syndicates while locking innocent customers.
        </p>
      </div>

      {/* The 5 Critical Vulnerabilities of Tabular Systems */}
      <section className="mb-20">
        <h2 className="text-xs font-mono uppercase text-[#00ff66] tracking-wider mb-6 text-center">
          Five Fundamental Flaws in Legacy Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Flaw 1 */}
          <div className="liquid-glass p-6 rounded-2xl border border-red-500/20">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1. Multi-Hop Blindness</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Relational databases require $O(N^k)$ table self-joins. Querying beyond 2 hops causes massive database locks and timeouts. Fraud syndicates exploit this by inserting 3 or 4 intermediary mule accounts.
            </p>
          </div>

          {/* Flaw 2 */}
          <div className="liquid-glass p-6 rounded-2xl border border-amber-500/20">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2. Circular Layering Loops</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Syndicates structure circular payments (A &rarr; B &rarr; C &rarr; A) to launder funds. Because each individual transaction appears balanced, tabular rules never catch the loop without global topological context.
            </p>
          </div>

          {/* Flaw 3 */}
          <div className="liquid-glass p-6 rounded-2xl border border-red-500/20">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <ShieldX className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. The 50% False Positive Disaster</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Heuristics that flag &quot;shared address + shared IP&quot; fail catastrophically on innocent family clusters. Legitimate households are frozen, generating high customer support churn and reputation damage.
            </p>
          </div>

          {/* Flaw 4 */}
          <div className="liquid-glass p-6 rounded-2xl border border-amber-500/20">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">4. Sub-Threshold Smurfing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              By structuring transfers just under regulatory reporting thresholds (e.g., $9,800 instead of $10,000), dispersed feeder accounts evade isolated amount filters. Only aggregate graph fan-in reveals the crime.
            </p>
          </div>

          {/* Flaw 5 */}
          <div className="liquid-glass p-6 rounded-2xl border border-purple-500/20">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">5. Cyber & Fraud Disconnection</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Security Operations Centers (SOC) and Fraud Teams operate in silos. When an infrastructure zero-day (like CVE-2024-3094) leaks credentials, fraud systems don&apos;t correlate the breach until millions are stolen.
            </p>
          </div>

          {/* Solution Teaser */}
          <div className="liquid-glass-neon p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66] mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">The SENGRA Solution</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Graph-native traversals over FalkorDB Cloud, in-memory Graphology Louvain clustering, Rule F4 automated freeze governance, and Sarvam 105B agent reasoning.
              </p>
            </div>
            <Link
              href="/docs"
              className="mt-4 text-xs font-mono text-[#00ff66] hover:underline flex items-center gap-1"
            >
              <span>See How the Solution Functions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Matrix: Legacy vs SENGRA */}
      <section className="mb-20 liquid-glass p-8 rounded-3xl border border-white/[0.08]">
        <h2 className="text-xl font-bold text-white mb-6 font-sans">
          Side-by-Side Comparison: Traditional Rules vs SENGRA
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th className="pb-3">DIMENSION</th>
                <th className="pb-3 text-red-400">LEGACY TABULAR RULES</th>
                <th className="pb-3 text-[#00ff66]">SENGRA GRAPH INTEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-zinc-300">
              <tr>
                <td className="py-3 font-semibold text-white">Multi-Hop Traversal</td>
                <td className="py-3 text-red-400">Fails beyond 2 hops (SQL timeout)</td>
                <td className="py-3 text-[#00ff66]">Arbitrary depth in sub-5ms (FalkorDB)</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Family Cluster Accuracy</td>
                <td className="py-3 text-red-400">50% False Positive Rate (Innocent locks)</td>
                <td className="py-3 text-[#00ff66]">0% False Positive Rate (Skeptic Cleared)</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Structuring / Smurfing</td>
                <td className="py-3 text-red-400">Blind to sub-threshold amounts</td>
                <td className="py-3 text-[#00ff66]">Unmasked via betweenness & fan-in</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Autonomous Freeze Safety</td>
                <td className="py-3 text-red-400">Uncontrolled or completely manual</td>
                <td className="py-3 text-[#00ff66]">Rule F4 Gated Policy Engine</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">AI Copilot Reasoning</td>
                <td className="py-3 text-red-400">Opaque black-box risk scores</td>
                <td className="py-3 text-[#00ff66]">Sarvam 105B plain-English explanations</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl neon-button text-sm font-mono font-bold"
        >
          <span>Test Live Syndicates on the Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
