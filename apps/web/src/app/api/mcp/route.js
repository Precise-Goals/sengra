/**
 * @file apps/web/src/app/api/mcp/route.js
 * @description Next.js App Router API route providing the MCP JSON-RPC 2.0 endpoint for fraud tools.
 */

import { NextResponse } from "next/server";
import { TOOL_CATALOG, executeTool } from "@sengra/tools";

export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({
    name: "sengra-mcp-server",
    protocolVersion: "2024-11-05",
    toolsCount: TOOL_CATALOG.length,
    status: "healthy",
  });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: { code: -32700, message: "Parse error: Invalid JSON." },
      },
      { status: 400 }
    );
  }

  const { jsonrpc, id, method, params = {} } = body;

  if (method === "tools/list") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: id || null,
      result: {
        tools: TOOL_CATALOG,
      },
    });
  }

  if (method === "tools/call") {
    const toolName = params.name;
    const toolArgs = params.arguments || params.params || {};

    if (!toolName) {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id || null,
          error: { code: -32602, message: "Invalid params: 'name' is required for tools/call." },
        },
        { status: 400 }
      );
    }

    const execution = await executeTool(toolName, toolArgs);

    return NextResponse.json({
      jsonrpc: "2.0",
      id: id || null,
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify(execution.success ? execution.data : { error: execution.error }),
          },
        ],
        isError: !execution.success,
      },
    });
  }

  return NextResponse.json(
    {
      jsonrpc: "2.0",
      id: id || null,
      error: { code: -32601, message: `Method '${method}' not found.` },
    },
    { status: 404 }
  );
}
