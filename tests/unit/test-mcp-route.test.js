/**
 * @file tests/unit/test-mcp-route.test.js
 * @description Unit tests for Next.js App Router MCP endpoint (/api/mcp).
 */

import { describe, it, expect } from "bun:test";
import { GET, POST } from "../../apps/web/src/app/api/mcp/route.js";

describe("MCP HTTP JSON-RPC 2.0 Route Tests", () => {
  it("responds to GET with health status and tool count", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.toolsCount).toBe(11);
    expect(data.protocolVersion).toBe("2024-11-05");
  });

  it("handles tools/list method via POST", async () => {
    const req = new Request("http://localhost:3000/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "req-1",
        method: "tools/list",
      }),
    });

    const response = await POST(req);
    const data = await response.json();
    expect(data.jsonrpc).toBe("2.0");
    expect(data.id).toBe("req-1");
    expect(data.result).toBeDefined();
    expect(data.result.tools.length).toBe(11);
  });

  it("handles tools/call for evaluate_freeze_policy", async () => {
    const req = new Request("http://localhost:3000/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "req-2",
        method: "tools/call",
        params: {
          name: "evaluate_freeze_policy",
          arguments: {
            accountId: "ACC_MULE_TEST",
            flaggedInComponent: 4,
            hopsToBadDevice: 1,
            crossCheckPassed: true,
          },
        },
      }),
    });

    const response = await POST(req);
    const data = await response.json();
    expect(data.jsonrpc).toBe("2.0");
    expect(data.id).toBe("req-2");
    expect(data.result.isError).toBe(false);
    expect(data.result.content[0].type).toBe("text");

    const parsedContent = JSON.parse(data.result.content[0].text);
    expect(parsedContent.decision).toBe("FREEZE");
  });

  it("returns -32601 for unsupported methods", async () => {
    const req = new Request("http://localhost:3000/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "req-3",
        method: "unknown/method",
      }),
    });

    const response = await POST(req);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(data.error.code).toBe(-32601);
  });
});
