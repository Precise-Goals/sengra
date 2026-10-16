# SENGRA Model Context Protocol (MCP) Configuration Reference

> Universal configuration manifest for SENGRA MCP servers across AI agents, IDEs, and automation runners.

## Unified Client Configuration (`mcp_config.json`)

Add this configuration to your AI agent client to enable full platform introspection, FalkorDB OpenCypher execution, React Bits UI registry access, Playwright headless browser testing, Next.js devtools, persistent cross-session memory with Mem0, multi-step sequential thinking, Sentry error observability, Linear incident ticketing, and Firecrawl OSINT threat intelligence:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "falkordb": {
      "command": "npx",
      "args": ["-y", "@falkordb/mcpserver@latest"],
      "env": {
        "FALKORDB_HOST": "localhost",
        "FALKORDB_PORT": "6379",
        "FALKORDB_DEFAULT_READONLY": "false"
      }
    },
    "falkordb-readonly": {
      "command": "npx",
      "args": ["-y", "@falkordb/mcpserver@latest"],
      "env": {
        "FALKORDB_HOST": "localhost",
        "FALKORDB_PORT": "6379",
        "FALKORDB_DEFAULT_READONLY": "true"
      }
    },
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    },
    "magicuidesign-mcp": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"]
    },
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    },
    "sengra-mcp": {
      "url": "http://localhost:3000/api/mcp"
    },
    "sequential-thinking": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "mem0": {
      "url": "https://mcp.mem0.ai/mcp"
    },
    "sentry": {
      "url": "https://mcp.sentry.dev/mcp"
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    },
    "firecrawl": {
      "url": "https://mcp.firecrawl.dev/v2/mcp-oauth"
    }
  }
}
```

---

## Client-Specific Setup Instructions

### 1. Antigravity & Antigravity IDE
Place configuration at:
- Project root: `.agents/mcp_config.json`
- Global config: `~/.gemini/config/mcp_config.json`

### 2. Claude Code
Install via Claude Code CLI:
```bash
claude mcp add playwright npx -y @playwright/mcp@latest
claude mcp add falkordb npx -y @falkordb/mcpserver@latest
claude mcp add magicuidesign npx -y @magicuidesign/mcp@latest
claude mcp add shadcn npx shadcn@latest mcp
claude mcp add sequential-thinking npx -y @modelcontextprotocol/server-sequential-thinking
claude mcp add --transport http mem0-mcp https://mcp.mem0.ai/mcp
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp-oauth
```

### 3. Cursor
Open **Cursor Settings** $\rightarrow$ **MCP** $\rightarrow$ **Add new MCP Server**:
- Name: `playwright`, Type: `command`, Command: `npx -y @playwright/mcp@latest`
- Name: `falkordb`, Type: `command`, Command: `npx -y @falkordb/mcpserver@latest`
- Name: `shadcn`, Type: `command`, Command: `npx shadcn@latest mcp`
- Name: `magicuidesign`, Type: `command`, Command: `npx -y @magicuidesign/mcp@latest`
- Name: `sequential-thinking`, Type: `command`, Command: `npx -y @modelcontextprotocol/server-sequential-thinking`
- Name: `mem0-mcp`, Type: `http`, URL: `https://mcp.mem0.ai/mcp`
- Name: `sentry`, Type: `http`, URL: `https://mcp.sentry.dev/mcp`
- Name: `linear`, Type: `command`, Command: `npx -y mcp-remote https://mcp.linear.app/mcp`
- Name: `firecrawl`, Type: `http`, URL: `https://mcp.firecrawl.dev/v2/mcp-oauth`

### 4. VS Code / GitHub Copilot
Add to `.vscode/mcp.json` or run:
```bash
code --add-mcp '{"name":"playwright","command":"npx","args":["-y","@playwright/mcp@latest"]}'
code --add-mcp '{"name":"falkordb","command":"npx","args":["-y","@falkordb/mcpserver@latest"]}'
code --add-mcp '{"name":"sequentialthinking","command":"npx","args":["-y","@modelcontextprotocol/server-sequential-thinking"]}'
code --add-mcp '{"name":"linear","command":"npx","args":["-y","mcp-remote","https://mcp.linear.app/mcp"]}'
```

### 5. Codex
Edit `~/.codex/config.toml`:
```toml
[mcp_servers.playwright]
command = "npx"
args = ["-y", "@playwright/mcp@latest"]

[mcp_servers.falkordb]
command = "npx"
args = ["-y", "@falkordb/mcpserver@latest"]

[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]

[mcp_servers.sequential-thinking]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-sequential-thinking"]

[mcp_servers.mem0]
url = "https://mcp.mem0.ai/mcp"
bearer_token_env_var = "MEM0_API_KEY"

[mcp_servers.linear]
url = "https://mcp.linear.app/mcp"
```

### 6. Windsurf & Cline
In `cline_mcp_settings.json` or `.windsurf/mcp.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "falkordb": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@falkordb/mcpserver@latest"]
    },
    "mem0-mcp": {
      "type": "http",
      "url": "https://mcp.mem0.ai/mcp"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

---

## Environment Variables Configuration

| Variable | Description | Default |
|---|---|---|
| `FALKORDB_HOST` | Redis host for FalkorDB graph engine | `localhost` |
| `FALKORDB_PORT` | Redis port for FalkorDB graph engine | `6379` |
| `FALKORDB_PASSWORD` | Optional password authentication | `""` |
| `FALKORDB_DEFAULT_READONLY` | Force read-only replica queries (`GRAPH.RO_QUERY`) | `false` |
| `PLAYWRIGHT_MCP_HEADLESS` | Run Playwright browser in headless mode | `true` |
| `MEM0_API_KEY` | Bearer token for Mem0 hosted memory platform | `""` |
| `SARVAM_API_KEY` | API subscription key for Sarvam 105B Conversations | `sk_mhp6zj2k...` |
| `SARVAM_BASE_URL` | Upstream endpoint for Sarvam AI | `https://api.sarvam.ai` |
| `SARVAM_MODEL` | Targeted Sarvam reasoning model | `sarvam-105b-conversations` |
