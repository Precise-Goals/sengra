"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "The Problem" },
  { href: "/docs", label: "Solution Docs" },
  { href: "/compare", label: "Benchmark" },
  { href: "/security", label: "Security Ops" },
  { href: "/memory", label: "Memory" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#020408]/85 backdrop-blur-xl">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.05]">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  isActive
                    ? "text-[#00ff66] bg-[#00ff66]/10 font-bold shadow-[0_0_12px_rgba(0,255,102,0.18)] border border-[#00ff66]/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Status Pill & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
            <span className="text-zinc-300">FalkorDB Cloud</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[#00ff66]">Connected</span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00ff66] hover:bg-[#00ff66]/90 text-black text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)]"
          >
            <span>Launch Console</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#020408]/95 px-4 pt-3 pb-4 space-y-1 backdrop-blur-2xl">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                  isActive
                    ? "text-[#00ff66] bg-[#00ff66]/10 font-bold border border-[#00ff66]/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
