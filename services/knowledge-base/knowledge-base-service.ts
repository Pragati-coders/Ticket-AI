import { prisma } from "@/lib/db/prisma";
import type { CreateKnowledgeBaseInput } from "@/lib/validation/knowledge-base";
import { chunkText } from "@/services/rag/document-parser";
import { storeEmbedding } from "@/services/rag/rag-service";

export async function listKnowledgeBase() {
  return prisma.knowledgeBase.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { embeddings: true } } }
  });
}

export async function createKnowledgeBase(input: CreateKnowledgeBaseInput) {
  const slug = slugify(input.title);
  const article = await prisma.knowledgeBase.create({
    data: {
      title: input.title,
      slug: `${slug}-${Date.now()}`,
      content: input.content,
      sourceUrl: input.sourceUrl || null,
      status: input.status,
      department: input.department
    }
  });

  for (const chunk of chunkText(input.content)) {
    await storeEmbedding(article.id, chunk);
  }

  return article;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
