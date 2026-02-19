import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { Client } from "https://esm.sh/@modelcontextprotocol/sdk@1.26.0/client/index.js?deps=zod@3";
import { StreamableHTTPClientTransport } from "https://esm.sh/@modelcontextprotocol/sdk@1.26.0/client/streamableHttp.js?deps=zod@3";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Provider = "claude" | "openai";

interface McpChatRequest {
  prompt: string;
  provider: Provider;
}

// ─── MCP Server URL ──────────────────────────────────────────────────────────
// Set MCP_SERVER_URL secret in Supabase for production.
// For local dev, SUPABASE_URL resolves to http://127.0.0.1:54321 automatically.
function getMcpServerUrl(): string {
  const explicit = Deno.env.get("MCP_SERVER_URL");
  if (explicit) return explicit;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (supabaseUrl) return `${supabaseUrl}/functions/v1/mcp-server`;

  throw new Error("Cannot determine MCP_SERVER_URL: SUPABASE_URL is not set");
}

// ─── MCP Client ──────────────────────────────────────────────────────────────
async function buildMcpClient(jwt: string): Promise<Client> {
  const client = new Client(
    { name: "virtual-wallet-mcp-client", version: "1.0.0" },
    { capabilities: {} },
  );

  const transport = new StreamableHTTPClientTransport(
    new URL(getMcpServerUrl()),
    {
      requestInit: {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    },
  );

  await client.connect(transport);
  return client;
}

// ─── Tool schema converters ──────────────────────────────────────────────────
type McpTool = Awaited<ReturnType<Client["listTools"]>>["tools"][number];

function toAnthropicTools(mcpTools: McpTool[]): Anthropic.Tool[] {
  return mcpTools.map((tool) => ({
    name: tool.name,
    description: tool.description ?? "",
    input_schema: {
      type: "object" as const,
      properties:
        (tool.inputSchema.properties as Record<string, unknown>) ?? {},
      required: (tool.inputSchema.required as string[]) ?? [],
    },
  }));
}

function toOpenAITools(mcpTools: McpTool[]): OpenAI.Chat.ChatCompletionTool[] {
  return mcpTools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description ?? "",
      parameters: {
        type: "object",
        properties:
          (tool.inputSchema.properties as Record<string, unknown>) ?? {},
        required: (tool.inputSchema.required as string[]) ?? [],
      },
    },
  }));
}

// ─── Tool result extraction ──────────────────────────────────────────────────
type CallToolResult = Awaited<ReturnType<Client["callTool"]>>;

function extractToolResultText(result: CallToolResult): string {
  const content = result.content as unknown as Array<{
    type: string;
    text?: string;
  }>;
  if (!content || content.length === 0) return "";
  const textBlock = content.find((b) => b.type === "text");
  if (textBlock?.text !== undefined) return textBlock.text;
  return JSON.stringify(content[0]);
}

// ─── Claude agentic loop ─────────────────────────────────────────────────────
async function runClaude(
  anthropic: Anthropic,
  prompt: string,
  mcpClient: Client,
): Promise<string> {
  const { tools: mcpTools } = await mcpClient.listTools();
  const anthropicTools = toAnthropicTools(mcpTools);

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: prompt },
  ];

  for (let i = 0; i < 5; i++) {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      tools: anthropicTools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const text = response.content.find((b) => b.type === "text");
      return text ? text.text : "";
    }

    if (response.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        response.content
          .filter(
            (b: Anthropic.ContentBlock): b is Anthropic.ToolUseBlock =>
              b.type === "tool_use",
          )
          .map(async (toolUse: Anthropic.ToolUseBlock) => ({
            type: "tool_result" as const,
            tool_use_id: toolUse.id,
            content: extractToolResultText(
              await mcpClient.callTool({
                name: toolUse.name,
                arguments: toolUse.input as Record<string, unknown>,
              }),
            ),
          })),
      );

      messages.push({ role: "user", content: toolResults });
      continue;
    }

    const text = response.content.find((b) => b.type === "text");
    return text ? text.text : "";
  }

  return "Could not generate a response.";
}

// ─── OpenAI agentic loop ─────────────────────────────────────────────────────
async function runOpenAI(
  openai: OpenAI,
  prompt: string,
  mcpClient: Client,
): Promise<string> {
  const { tools: mcpTools } = await mcpClient.listTools();
  const openAITools = toOpenAITools(mcpTools);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "user", content: prompt },
  ];

  for (let i = 0; i < 5; i++) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      tools: openAITools,
      messages,
    });

    const choice = response.choices[0];

    if (choice.finish_reason === "stop") {
      return choice.message.content ?? "";
    }

    if (choice.finish_reason === "tool_calls") {
      messages.push(choice.message);

      const toolResults: OpenAI.Chat.ChatCompletionToolMessageParam[] =
        await Promise.all(
          (choice.message.tool_calls ?? []).map(
            async (toolCall: OpenAI.Chat.ChatCompletionMessageToolCall) => ({
              role: "tool" as const,
              tool_call_id: toolCall.id,
              content: extractToolResultText(
                await mcpClient.callTool({
                  name: toolCall.function.name,
                  arguments: JSON.parse(toolCall.function.arguments || "{}"),
                }),
              ),
            }),
          ),
        );

      messages.push(...toolResults);
      continue;
    }

    return choice.message.content ?? "";
  }

  return "Could not generate a response.";
}

// ─── Credit error helper ─────────────────────────────────────────────────────
function parseCreditError(err: unknown, provider: Provider): string | null {
  const raw = err instanceof Error ? err.message : String(err);

  if (provider === "claude" && raw.includes("credit balance is too low")) {
    return "No Anthropic credits available. Add credits at console.anthropic.com → Plans & Billing.";
  }

  if (
    provider === "openai" &&
    (raw.includes("exceeded your current quota") ||
      raw.includes("insufficient_quota"))
  ) {
    return "No OpenAI credits available. Add credits at platform.openai.com → Billing.";
  }

  return null;
}

// ─── Main handler ────────────────────────────────────────────────────────────
Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  let provider: Provider = "claude";

  try {
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

    const body: McpChatRequest = await req.json();
    const { prompt, provider: requestedProvider = "claude" } = body;
    provider = requestedProvider;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "prompt is required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const mcpClient = await buildMcpClient(jwt);

    let response: string;

    if (provider === "openai") {
      const apiKey = Deno.env.get("OPENAI_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
          {
            status: 500,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          },
        );
      }
      response = await runOpenAI(new OpenAI({ apiKey }), prompt, mcpClient);
    } else {
      const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
          {
            status: 500,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          },
        );
      }
      response = await runClaude(new Anthropic({ apiKey }), prompt, mcpClient);
    }

    return new Response(JSON.stringify({ response }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    const creditError = parseCreditError(err, provider);
    const message =
      creditError ?? (err instanceof Error ? err.message : String(err));

    console.error("mcp-client error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
