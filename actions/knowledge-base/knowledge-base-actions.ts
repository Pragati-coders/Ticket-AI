"use server";

import { revalidatePath } from "next/cache";

import { createKnowledgeBaseSchema } from "@/lib/validation/knowledge-base";
import { createKnowledgeBase } from "@/services/knowledge-base";

export async function createKnowledgeBaseAction(input: unknown) {
  const article = await createKnowledgeBase(createKnowledgeBaseSchema.parse(input));
  revalidatePath("/knowledge-base");

  return article;
}
