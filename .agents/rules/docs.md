# AGY Documentation Reference & Directory Architecture Rule

## Core Directives for Antigravity (AGY)
1. **Parent Directory Cleanliness**: The parent workspace directory strictly contains only `README.md`. All other markdown documentation files are strictly organized inside the `docs/` directory.
2. **Strict Docs Centralization**: Always reference and maintain documentation within `docs/`:
   - **Agent Operating Map & Commands**: [docs/AGENTS.md](docs/AGENTS.md)
   - **Boot Sequence & Master Prompt**: [docs/prompt.md](docs/prompt.md)
   - **Harness & Quality Gates (G0-G4)**: [docs/harness.md](docs/harness.md)
   - **Universal Multi-Client MCP Config**: [docs/mcp.md](docs/mcp.md)
   - **Exhaustive 12-Server MCP Guide**: [docs/mcpguide.md](docs/mcpguide.md)
   - **Assistant Guide**: [docs/CLAUDE.md](docs/CLAUDE.md)
   - **Raw Problem Statement & Ground Truth**: [docs/raw.md](docs/raw.md)
   - **System Architecture**: [docs/architecture.md](docs/architecture.md)
   - **Evaluation & Benchmark Report**: [docs/eval-report.md](docs/eval-report.md)
   - **Cypher Query Reference & Constraints**: [docs/cypher.md](docs/cypher.md)
   - **Troubleshooting & Known Limitations**: [docs/troubleshooting.md](docs/troubleshooting.md)
   - **Lessons & Anti-Patterns**: [docs/memory/lessons.md](docs/memory/lessons.md)
   - **Assumptions**: [docs/memory/assumptions.md](docs/memory/assumptions.md)
3. **Operational Precedence**: When starting any task, verify project context via `docs/AGENTS.md` and `docs/prompt.md`. Never create loose `.md` files in the root workspace directory.
