import { z } from "zod";

export const ticketStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER", "RESOLVED", "CLOSED"]);
export const ticketPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const ticketSentimentSchema = z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]);
export const replyVisibilitySchema = z.enum(["PUBLIC", "INTERNAL"]);

export const ticketQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  categoryId: z.string().optional(),
  sort: z.enum(["createdAt", "updatedAt", "priority", "status"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
});

export const createTicketSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(8000),
  priority: ticketPrioritySchema.default("MEDIUM"),
  categoryId: z.string().optional(),
  department: z.string().trim().max(120).optional()
});

export const updateTicketSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().trim().min(10).max(8000).optional(),
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  sentiment: ticketSentimentSchema.optional(),
  categoryId: z.string().nullable().optional(),
  assignedAgentId: z.string().nullable().optional(),
  department: z.string().trim().max(120).nullable().optional()
});

export const createReplySchema = z.object({
  body: z.string().trim().min(2).max(8000),
  visibility: replyVisibilitySchema.default("PUBLIC"),
  isAiDraft: z.boolean().default(false)
});

export type TicketQueryInput = z.infer<typeof ticketQuerySchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type CreateReplyInput = z.infer<typeof createReplySchema>;
