/**
 * @file tests/unit/test-sarvam-route.test.js
 * @description Unit tests for Sarvam AI 105B Conversations endpoint (/api/sarvam) and enrichment in /api/chat.
 */

import { describe, it, expect } from "bun:test";
import { GET, POST } from "../../apps/web/src/app/api/sarvam/route.js";
import { POST as chatPOST } from "../../apps/web/src/app/api/chat/route.js";

describe("Sarvam AI Route (/api/sarvam) Tests", () => {
  it("responds to GET with health status, model, and capabilities", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.endpoint).toBe("/api/sarvam");
    expect(data.provider).toBe("Sarvam AI");
    expect(data.model).toBe("sarvam-105b-conversations");
    expect(Array.isArray(data.capabilities)).toBe(true);
    expect(data.capabilities).toContain("sarvam-105b-conversations");
    expect(data.capabilities).toContain("streaming-sse");
  });

  it("handles conversational prompt via POST", async () => {
    const req = new Request("http://localhost:3000/api/sarvam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Summarize smurfing in AML topology in one sentence.",
        context: {
          accountId: "A-TEST-MULE-1",
          flaggedInComponent: 5,
          hopsToBadDevice: 1,
        },
      }),
    });

    const response = await POST(req);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toBeDefined();
    expect(typeof data.message.content).toBe("string");
    expect(data.message.content.length).toBeGreaterThan(10);
  });

  it("returns 400 when body has neither messages nor prompt/query", async () => {
    const req = new Request("http://localhost:3000/api/sarvam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("returns 400 on malformed JSON body", async () => {
    const req = new Request("http://localhost:3000/api/sarvam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "NOT_VALID_JSON",
    });

    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("enriches /api/chat investigation when enrichWithSarvam is true", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: "A-RINGA-1",
        enrichWithSarvam: true,
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

    const response = await chatPOST(req);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.decision).toBe("FREEZE");
    expect(data.data.sarvamInsight).toBeDefined();
    expect(data.data.sarvamInsight.model).toContain("sarvam-105b-conversations");
  });
});
