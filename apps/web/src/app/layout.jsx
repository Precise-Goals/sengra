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

import Navbar from "../components/Navbar";

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
        {/* Dynamic Client Navigation Bar */}
        <Navbar />

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
