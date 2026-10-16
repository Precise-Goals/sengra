import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** @type {import('next').Metadata} */
export const metadata = {
  title: "SENGRA — Graph-Native Financial Crime Intelligence",
  description:
    "Autonomous financial crime investigation platform powered by FalkorDB Cloud, Sarvam AI (105B), MCP tools, and graph analytics.",
};

/**
 * @param {{ children: React.ReactNode }} props
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#020408] text-slate-100 selection:bg-[#00ff66]/30 selection:text-[#00ff66]">
        {/* Global Liquid Glass Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] liquid-glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-black border border-[#00ff66]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,102,0.25)] group-hover:border-[#00ff66] transition-colors">
                <span className="font-mono text-[#00ff66] font-bold text-sm">S</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold tracking-wider text-white text-base">
                    SENGRA
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
                  Graph Crime Intel
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-xs font-mono text-[#00ff66] hover:bg-[#00ff66]/10 rounded-md transition-colors font-semibold"
              >
                Dashboard
              </Link>
              <Link
                href="/about"
                className="px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
              >
                The Problem
              </Link>
              <Link
                href="/docs"
                className="px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
              >
                Solution Docs
              </Link>
              <Link
                href="/compare"
                className="px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
              >
                Benchmark
              </Link>
              <Link
                href="/security"
                className="px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
              >
                Security Ops
              </Link>
              <Link
                href="/memory"
                className="px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
              >
                Memory
              </Link>
            </nav>

            {/* Right Status Pill & CTA */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                <span className="text-zinc-400">Sarvam 105B:</span>
                <span className="text-[#00ff66]">Active</span>
              </div>
              <Link
                href="/dashboard"
                className="px-3.5 py-1.5 rounded-lg neon-button text-xs font-mono flex items-center gap-1.5"
              >
                <span>Launch Console</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Liquid Glass Footer */}
        <footer className="w-full border-t border-white/[0.08] liquid-glass py-6 text-xs text-zinc-400 font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">SENGRA</span>
              <span className="text-zinc-600">|</span>
              <span>FalkorDB Cloud · Sarvam AI (105B) · Graphology · Next.js</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/about" className="hover:text-white transition-colors">
                The Problem
              </Link>
              <Link href="/docs" className="hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/compare" className="hover:text-white transition-colors">
                Benchmark
              </Link>
              <a
                href="https://github.com/Precise-Goals/sengra"
                target="_blank"
                rel="noreferrer"
                className="text-[#00ff66] hover:underline"
              >
                GitHub &rarr;
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
