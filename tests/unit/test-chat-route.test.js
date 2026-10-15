/**
 * @file tests/unit/test-chat-route.test.js
 * @description Unit tests for Next.js App Router chat endpoint (/api/chat).
 */

import { describe, it, expect } from "bun:test";
import { GET, POST } from "../../apps/web/src/app/api/chat/route.js";

describe("Chat Route (/api/chat) Tests", () => {
  it("responds to GET with agent status and model metadata", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.agent).toBe("SENGRA Fraud Investigator");
    expect(data.model).toBe("claude-3-5-sonnet-20241022");
  });

  it("handles investigation request via POST without external API key", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: "A-RINGA-1",
        context: {
          flaggedInComponent: 4,
          hopsToBadDevice: 1,
          badDevices: ["D-17"],
          subgraph: {
            nodes: [{ id: "A-RINGA-1" }, { id: "D-17" }],
            edges: [{ source: "A-RINGA-1", target: "D-17" }],
          },
        },
      }),
    });

    const response = await POST(req);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.decision).toBe("FREEZE");
    expect(data.data.accountId).toBe("A-RINGA-1");
  });

  it("returns 400 on invalid JSON body", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "INVALID_JSON",
    });

    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});
