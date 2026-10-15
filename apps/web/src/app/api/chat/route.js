/**
 * @file apps/web/src/app/api/chat/route.js
 * @description Next.js App Router streaming chat endpoint for SENGRA fraud investigation agent.
 */

import { NextResponse } from "next/server";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT, createAgentTools, runInvestigation } from "@sengra/agent";

export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    endpoint: "/api/chat",
    agent: "SENGRA Fraud Investigator",
    model: "claude-3-5-sonnet-20241022",
  });
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { messages, context, accountId } = body;

  // If ANTHROPIC_API_KEY is present and messages are provided, run live streaming Claude
  if (process.env.ANTHROPIC_API_KEY && Array.isArray(messages) && messages.length > 0) {
    try {
      const result = streamText({
        model: anthropic("claude-3-5-sonnet-20241022"),
        system: SYSTEM_PROMPT,
        messages,
        tools: createAgentTools(),
        maxSteps: 10,
      });

      return result.toDataStreamResponse();
    } catch (err) {
      // Fallback to deterministic orchestrator on API failure
      console.error("AI SDK stream error, falling back to deterministic orchestrator:", err.message);
    }
  }

  // Deterministic investigation runner fallback (ensures tests, local demos, and offline benchmarks succeed)
  const targetId = accountId || (messages && messages[messages.length - 1]?.content) || "UNKNOWN";
  const investigation = await runInvestigation({
    accountId: typeof targetId === "string" ? targetId.replace(/[^A-Za-z0-9_-]/g, "") : "UNKNOWN",
    ...context,
  });

  return NextResponse.json({
    success: true,
    data: investigation,
  });
}
