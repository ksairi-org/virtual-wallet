import { McpServer } from "https://esm.sh/@modelcontextprotocol/sdk@1.26.0/server/mcp.js?deps=zod@3";
import { WebStandardStreamableHTTPServerTransport } from "https://esm.sh/@modelcontextprotocol/sdk@1.26.0/server/webStandardStreamableHttp.js?deps=zod@3";
import { createClient } from "@supabase/supabase-js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, mcp-session-id, mcp-protocol-version",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
};

async function getUserNameFromJwt(jwt: string): Promise<string> {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !user) {
    return "Could not retrieve user information.";
  }

  const firstName = user.user_metadata?.firstName ?? "";
  const lastName = user.user_metadata?.lastName ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || "Unknown";
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const authHeader = req.headers.get("Authorization");
  const jwt = authHeader?.replace("Bearer ", "").trim();

  if (!jwt) {
    return new Response(
      JSON.stringify({ error: "Authorization header is required" }),
      {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  // Fresh McpServer + transport per request — stateless edge function pattern
  const server = new McpServer(
    { name: "virtual-wallet-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  // JWT is captured via closure — safe because server is created per-request
  server.tool(
    "get_user_name",
    "Get the authenticated user's full name (first and last name) from the database.",
    {},
    async () => {
      const fullName = await getUserNameFromJwt(jwt);
      return {
        content: [{ type: "text" as const, text: fullName }],
      };
    },
  );

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — no session tracking
    enableJsonResponse: true, // return JSON instead of SSE for stateless calls
  });

  await server.connect(transport);

  const response = await transport.handleRequest(req);

  // Merge CORS headers onto the transport's own Response
  const responseHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    responseHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
});
