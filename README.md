# SENGRA: Graph-Native Fraud Agent

> Hackathon track: **Agents that act on connected data**
> Powered by **FalkorDB Cloud**, **Model Context Protocol (MCP)**, **Vercel AI SDK (Claude)**, **Cytoscape.js**, and in-process **Graphology** analytics.

---

## Overview

SENGRA is an autonomous fraud ring investigation agent that discovers organized fraud by following multi-hop relationships in a graph database, runs graph algorithms (WCC, PageRank, Louvain communities, betweenness centrality) as tools, remembers learned entities across sessions, and animates the exact evidence path behind every decision in a real-time dark ops console.

### Key Capabilities
- **Multi-Hop Traversal**: Connects transactions, accounts, devices, cards, and physical addresses to detect rings.
- **Dual-Path Compute**: In-database algorithms (`algo.WCC`, `algo.pageRank` in FalkorDB Cloud) + in-process analytics (Louvain, betweenness in Graphology).
- **Deterministic Policy Gates**: Strict graph evidence gates (`FREEZE`, `HOLD`, `NO_ACTION`) with a **Skeptic Check** clearing benign clusters (e.g. family sharing IP/address).
- **Cross-Session Memory**: Recalls past investigations, clearances, and learned patterns from the `agent_memory` graph.
- **Visual Explainability**: Every decision animates an edge-by-edge evidence path in Cytoscape.js.
- **Security Bonus Layer**: Bridges unpatched Internet-exposed services and CVEs through compromised credentials to live financial fraud.

---

## Monorepo Layout

```
sengra/
  apps/
    web/                  # Next.js 16 App Router UI & API routes (/api/chat, /api/mcp)
  packages/
    graph/                # FalkorDB client singleton & query builders
    schema/               # Zod schemas & JSDoc types for entities, edges, tool I/O
    tools/                # MCP tool definitions and handlers
    policy/               # Pure deterministic policy and skeptic rules
    memory/               # Agent memory recall and record operations
    analysis/             # Graphology in-process subgraph analytics
    data/                 # Seeded synthetic generator & ground truth
    agent/                # Prompts, agent loop, and baseline flat agent
    ui/                   # Shared React/Tailwind/shadcn UI components
    eval/                 # Metrics evaluation comparing graph vs baseline
    config/               # Shared ESLint, Prettier, and JSConfig
  docs/                   # Specifications, architecture, and memory logs
  harness/                # Autonomous agent harness, roles, and state
  scripts/                # Quality gate linters and circuit breakers
```

---

## Getting Started

### Prerequisites
- Node.js 20+ and `pnpm` (or `bun`)
- Python 3.10+ (for harness verification)
- FalkorDB Cloud account (managed TLS instance)
- Anthropic API Key (for Claude 3.5 Sonnet)

### Canonical Commands

| Purpose | Command |
|---|---|
| Install dependencies | `pnpm install` |
| Lint codebase | `pnpm turbo run lint` |
| Format check | `pnpm prettier --check "**/*.{js,jsx,json,md,yaml}"` |
| Type check | `pnpm turbo run check-types` |
| Run unit tests | `pnpm turbo run test` |
| Run integration tests | `pnpm turbo run test:integration` |
| Build all applications | `pnpm turbo run build` |
| Harness self-test | `python scripts/check_harness.py && pytest tests/harness` |
| Seed synthetic data | `pnpm seed` |
| Run baseline evaluation | `pnpm eval` |

---

## Documentation Links
- Operating Manual: [docs/prompt.md](docs/prompt.md)
- Single Source of Truth: [docs/harness.md](docs/harness.md)
- Problem Statement: [docs/raw.md](docs/raw.md)
- Agent Navigation Map: [AGENTS.md](AGENTS.md)
