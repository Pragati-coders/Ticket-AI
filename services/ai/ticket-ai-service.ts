import { prisma } from "@/lib/db/prisma";
import type { ClassifyTicketInput } from "@/lib/validation/ai";
import { semanticSearch } from "@/services/rag/rag-service";
import { CLAUDE_MODEL, getClaudeClient } from "@/services/ai/claude-client";

export type TicketClassification = {
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  department: string;
  category: string;
  summary: string;
};

const fallbackDepartments = ["Technical Support", "Finance", "Customer Success", "Security"];

export async function classifyTicket(input: ClassifyTicketInput): Promise<TicketClassification> {
  const client = getClaudeClient();

  if (!client) {
    return heuristicClassify(input);
  }

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    temperature: 0,
    tools: [
      {
        name: "classify_ticket",
        description: "Classify a customer support ticket for routing and urgency.",
        input_schema: {
          type: "object",
          properties: {
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] },
            sentiment: { type: "string", enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"] },
            department: { type: "string" },
            category: { type: "string" },
            summary: { type: "string" }
          },
          required: ["priority", "sentiment", "department", "category", "summary"]
        }
      }
    ],
    messages: [
      {
        role: "user",
        content: `Classify this support ticket.\nTitle: ${input.title}\nDescription: ${input.description}`
      }
    ]
  });

  const toolUse = response.content.find((item) => item.type === "tool_use" && item.name === "classify_ticket");

  if (toolUse?.type === "tool_use") {
    return toolUse.input as TicketClassification;
  }

  return heuristicClassify(input);
}

export async function generateAutoReply(ticketId: string, tone: "concise" | "empathetic" | "technical" = "empathetic") {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      customer: true,
      category: true,
      replies: { orderBy: { createdAt: "asc" }, take: 10 }
    }
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  const matches = await semanticSearch(`${ticket.title}\n${ticket.description}`, { limit: 4 });
  const context = matches.map((match: { title: any; content: any; }) => `- ${match.title}: ${match.content}`).join("\n");
  const client = getClaudeClient();

  if (!client) {
    return buildFallbackReply(ticket.title, tone, context);
  }

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 900,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: `Write a ${tone} customer support reply.\nTicket: ${ticket.title}\nDescription: ${ticket.description}\nKnowledge base:\n${context || "No matches."}\nAvoid promises that require unavailable data.`
      }
    ]
  });

  const text = response.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n")
    .trim();

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { aiSuggestedReply: text }
  });

  return text;
}

export async function streamAutoReply(ticketId: string) {
  const encoder = new TextEncoder();
  const reply = await generateAutoReply(ticketId);

  return new ReadableStream({
    start(controller) {
      for (const chunk of reply.match(/.{1,48}(\s|$)/g) ?? [reply]) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    }
  });
}

function heuristicClassify(input: ClassifyTicketInput): TicketClassification {
  const text = `${input.title} ${input.description}`.toLowerCase();
  const urgent = ["down", "outage", "security", "breach", "production", "urgent"].some((word) => text.includes(word));
  const billing = ["invoice", "billing", "payment", "renewal"].some((word) => text.includes(word));
  const negative = ["angry", "broken", "failed", "delay", "cannot", "error"].some((word) => text.includes(word));

  return {
    priority: urgent ? "URGENT" : negative ? "HIGH" : "MEDIUM",
    sentiment: negative ? "NEGATIVE" : "NEUTRAL",
    department: billing ? "Finance" : fallbackDepartments[0],
    category: billing ? "Billing" : "Technical Support",
    summary: input.description.slice(0, 240)
  };
}

function buildFallbackReply(title: string, tone: string, context: string) {
  return [
    "Thanks for reaching out.",
    `We received your request about "${title}" and are reviewing it with the right team.`,
    context ? "I found related guidance and will use it to narrow the next troubleshooting step." : null,
    tone === "technical" ? "Please share any recent changes, logs, and timestamps so we can isolate the cause quickly." : null
  ]
    .filter(Boolean)
    .join(" ");
}
