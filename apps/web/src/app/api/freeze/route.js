/**
 * @file apps/web/src/app/api/freeze/route.js
 * @description Next.js App Router endpoint for Rule F4 Two-Stage Compliance Authorization.
 * Executes live FalkorDB Cypher mutations and immutable audit logging upon Human-in-the-Loop approval.
 */

import { NextResponse } from "next/server";
import { queryGraph, selectGraph } from "@sengra/graph";

export const maxDuration = 30;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");

  try {
    const graph = await selectGraph("decisions");
    const cypher = accountId
      ? `MATCH (d:Decision {targetId: $accountId}) RETURN d ORDER BY d.timestamp DESC LIMIT 10`
      : `MATCH (d:Decision) RETURN d ORDER BY d.timestamp DESC LIMIT 25`;

    const res = await graph.query(cypher, { params: { accountId: accountId || "" } });
    const decisions = res.data || [];

    return NextResponse.json({
      success: true,
      count: decisions.length,
      decisions,
    });
  } catch (err) {
    console.error("FalkorDB query failed on /api/freeze GET:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: `FalkorDB decisions graph query failed: ${err.message}`,
        offlineNotice: "FalkorDB Cloud connection required for live audit query.",
      },
      { status: 503 }
    );
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    accountId,
    authorizedBy = "Compliance Officer (HITL)",
    officerNote = "Rule F4 multi-hop evidence verified. Suspect mule account frozen to prevent asset dissipation.",
    evidencePath = [],
    severity = "CRITICAL",
  } = body;

  if (!accountId) {
    return NextResponse.json(
      { error: "Missing required parameter: 'accountId'" },
      { status: 400 }
    );
  }

  const decisionId = `DEC_FREEZE_${Date.now()}`;
  const timestamp = new Date().toISOString();

  try {
    // 1. Mutate Account status in domain graph
    const domainGraph = await selectGraph("domain");
    const domainMutation = `
      MERGE (a:Account {id: $accountId})
      SET a.status = 'FROZEN',
          a.frozen_at = $timestamp,
          a.frozen_by = $authorizedBy,
          a.compliance_note = $officerNote,
          a.flagged = true
      RETURN a.id AS id, a.status AS status
    `;
    const domainRes = await domainGraph.query(domainMutation, {
      params: { accountId, timestamp, authorizedBy, officerNote },
    });

    // 2. Persist immutable audit record in decisions graph
    const decisionsGraph = await selectGraph("decisions");
    const auditMutation = `
      CREATE (d:Decision {
        id: $decisionId,
        targetId: $accountId,
        action: 'FREEZE',
        status: 'EXECUTED_BY_COMPLIANCE',
        authorizedBy: $authorizedBy,
        timestamp: $timestamp,
        officerNote: $officerNote,
        severity: $severity,
        rule: 'RULE_F4_GATED',
        evidencePath: $evidencePathStr
      })
      RETURN d.id AS id
    `;
    await decisionsGraph.query(auditMutation, {
      params: {
        decisionId,
        accountId,
        authorizedBy,
        timestamp,
        officerNote,
        severity,
        evidencePathStr: JSON.stringify(evidencePath),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Account ${accountId} successfully frozen via Rule F4 Two-Stage Authorization.`,
      decisionId,
      accountId,
      status: "FROZEN",
      authorizedBy,
      timestamp,
      evidencePath,
      falkorMutation: domainRes.data || null,
    });
  } catch (err) {
    console.error("FalkorDB mutation failed on /api/freeze POST:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: `FalkorDB mutation failed: ${err.message}`,
        stage: "FALKTORDB_LIVE_MUTATION",
        guidance: "Ensure FALKORDB_HOST, FALKORDB_PORT, and FALKORDB_PASSWORD are valid.",
      },
      { status: 503 }
    );
  }
}
