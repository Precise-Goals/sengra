/**
 * @file apps/web/src/app/api/sarvam/route.js
 * @description Next.js App Router API route integrating the Sarvam AI 105B Conversations model
 * for live forensic conversational fraud analysis, topological inquiry, and executive AML briefings.
 * Strictly executes live API calls with fail-loud error handling (zero dummy fallbacks).
 */

import { NextResponse } from "next/server";

export const maxDuration = 60;

const DEFAULT_SARVAM_BASE_URL = "https://api.sarvam.ai";
const DEFAULT_SARVAM_MODEL = "sarvam-105b-conversations";
const DEFAULT_SARVAM_KEY = "sk_mhp6zj2k_CZWnzOpKIR4wrCdCDUwa6hJY";

const FORENSIC_SYSTEM_PROMPT = `You are SENGRA's Lead Forensic Intelligence Analyst, powered by the Sarvam 105B Conversations model.
You specialize in autonomous financial crime graph forensics, multi-hop money laundering syndicates, smurfing structures, synthetic identity rings, and cybercrime-to-fraud credential compromises.
Your analysis must be grounded, precise, and compliant with FATF, FinCEN, PMLA, and RBI regulatory standards.

Structure your forensic report with these 4 standardized sections:
## 1. Executive Threat Verdict
State the primary decision (FREEZE, HOLD_FOR_REVIEW, or NO_ACTION), confidence level, and threat classification.

## 2. Topological Evidence & Multi-Hop Path
Detail the graph path (hops to bad devices, betweenness centrality bridges, circular transaction loops, shared infrastructure).

## 3. Rule F4 Policy Compliance & Thresholds
Explain why the Rule F4 deterministic gate approved or gated the action, and explicitly evaluate Skeptic challenge counter-factuals.

## 4. Regulatory SAR Action & Mitigation
Specify immediate statutory actions (e.g. FinCEN SAR filing, account isolation, credential revocation).`;

export async function GET() {
  const apiKey = process.env.SARVAM_API_KEY || DEFAULT_SARVAM_KEY;
  const baseUrl = process.env.SARVAM_BASE_URL || DEFAULT_SARVAM_BASE_URL;
  const model = process.env.SARVAM_MODEL || DEFAULT_SARVAM_MODEL;

  return NextResponse.json({
    status: "healthy",
    endpoint: "/api/sarvam",
    provider: "Sarvam AI",
    model,
    baseUrl,
    liveMode: true,
    capabilities: [
      "sarvam-105b-conversations",
      "forensic-conversational-analysis",
      "dual-phase-structured-reporting",
      "rule-f4-gated-compliance",
      "indic-multilingual-reasoning",
      "streaming-sse",
    ],
  });
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    messages: inputMessages,
    prompt,
    query,
    scenario,
    context = {},
    temperature = 0.2,
    max_tokens = 1024,
    systemPrompt = FORENSIC_SYSTEM_PROMPT,
  } = body;

  const apiKey = process.env.SARVAM_API_KEY || DEFAULT_SARVAM_KEY;
  const baseUrl = process.env.SARVAM_BASE_URL || DEFAULT_SARVAM_BASE_URL;
  const model = process.env.SARVAM_MODEL || DEFAULT_SARVAM_MODEL;

  // Build normalized messages array
  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];

  let contextSnippet = "";
  if (context && Object.keys(context).length > 0) {
    contextSnippet = `\n\n[Active Graph Topology Context: Target=${context.targetId || context.accountId || "N/A"}, ComponentFlagged=${context.flaggedInComponent || 0}, HopsToBadDevice=${context.hopsToBadDevice ?? "N/A"}, PolicyVerdict=${context.decision || "PENDING"}, EvidencePath=${JSON.stringify(context.evidencePath || [])}]`;
  } else if (scenario) {
    contextSnippet = `\n\n[Active Scenario: ${scenario.name || scenario.id}, Target=${scenario.targetId}, Decision=${scenario.decision}, EvidencePath=${JSON.stringify(scenario.evidencePath || [])}]`;
  }

  if (Array.isArray(inputMessages) && inputMessages.length > 0) {
    for (let i = 0; i < inputMessages.length; i++) {
      const msg = inputMessages[i];
      if (i === inputMessages.length - 1 && msg.role === "user") {
        messages.push({
          role: "user",
          content: msg.content + contextSnippet,
        });
      } else {
        messages.push({
          role: msg.role || "user",
          content: msg.content || "",
        });
      }
    }
  } else if (prompt || query) {
    messages.push({
      role: "user",
      content: (prompt || query) + contextSnippet,
    });
  } else {
    return NextResponse.json(
      { error: "Missing 'messages', 'prompt', or 'query' in request body." },
      { status: 400 }
    );
  }

  // Live upstream call to Sarvam AI 105B Conversations
  try {
    const upstreamUrl = `${baseUrl.replace(/\/+$/, "")}/v1/chat/completions`;
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      console.error(`Sarvam API upstream returned HTTP ${upstreamResponse.status}:`, errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Sarvam AI upstream returned HTTP ${upstreamResponse.status}`,
          details: errorText,
          model,
          endpoint: upstreamUrl,
        },
        { status: 502 }
      );
    }

    const data = await upstreamResponse.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Normalize formatting
    const cleanedContent = rawContent
      .replace(/\uFFFD/g, "")
      .replace(/\?\?\b/g, "")
      .replace(/(\r\n|\r)/g, "\n");

    return NextResponse.json({
      success: true,
      answer: cleanedContent,
      content: cleanedContent,
      message: {
        role: "assistant",
        content: cleanedContent,
      },
      model: data.model || model,
      usage: data.usage || null,
      id: data.id || null,
    });
  } catch (err) {
    console.error("Sarvam API network exception:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to connect to Sarvam AI upstream: ${err.message}`,
        model,
      },
      { status: 503 }
    );
  }
}
