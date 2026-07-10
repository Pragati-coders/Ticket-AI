import { z } from "zod";

export const classifyTicketSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(10)
});

export const generateReplySchema = z.object({
  ticketId: z.string().min(1),
  tone: z.enum(["concise", "empathetic", "technical"]).default("empathetic")
});

export type ClassifyTicketInput = z.infer<typeof classifyTicketSchema>;
export type GenerateReplyInput = z.infer<typeof generateReplySchema>;
