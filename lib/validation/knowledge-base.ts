import { z } from "zod";

export const knowledgeBaseStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createKnowledgeBaseSchema = z.object({
  title: z.string().trim().min(3).max(180),
  content: z.string().trim().min(20).max(50000),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  status: knowledgeBaseStatusSchema.default("DRAFT"),
  department: z.string().trim().max(120).optional()
});

export const uploadKnowledgeBaseSchema = z.object({
  title: z.string().trim().min(3).max(180),
  content: z.string().trim().min(20),
  fileName: z.string().trim().min(1),
  department: z.string().trim().max(120).optional()
});

export type CreateKnowledgeBaseInput = z.infer<typeof createKnowledgeBaseSchema>;
export type UploadKnowledgeBaseInput = z.infer<typeof uploadKnowledgeBaseSchema>;
