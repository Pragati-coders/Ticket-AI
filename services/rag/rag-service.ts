import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/db/prisma";
import { generateEmbedding, vectorToSql } from "@/services/rag/embedding-service";

export type SemanticSearchResult = {
  id: string;
  title: string;
  content: string;
  score: number;
};

export async function storeEmbedding(knowledgeBaseId: string, content: string) {
  const vector = vectorToSql(await generateEmbedding(content));
  const id = randomUUID();

  await prisma.$executeRawUnsafe(
    `INSERT INTO "Embedding" ("id", "content", "vector", "knowledgeBaseId") VALUES ($1, $2, $3::vector, $4)`,
    id,
    content,
    vector,
    knowledgeBaseId
  );

  return id;
}

export async function semanticSearch(query: string, options: { limit?: number; department?: string } = {}) {
  const vector = vectorToSql(await generateEmbedding(query));
  const limit = options.limit ?? 5;
  const sql = `SELECT e.id, kb.title, e.content, 1 - (e.vector <=> $1::vector) AS score
     FROM "Embedding" e
     JOIN "KnowledgeBase" kb ON kb.id = e."knowledgeBaseId"
     WHERE kb.status = 'PUBLISHED' ${options.department ? `AND kb.department = $3` : ""}
     ORDER BY e.vector <=> $1::vector
     LIMIT $2`;

  const rows = options.department
    ? await prisma.$queryRawUnsafe<SemanticSearchResult[]>(sql, vector, limit, options.department)
    : await prisma.$queryRawUnsafe<SemanticSearchResult[]>(sql, vector, limit);

  return rows;
}
