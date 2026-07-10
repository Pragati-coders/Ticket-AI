import { apiError, created, ok } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { createKnowledgeBaseSchema } from "@/lib/validation/knowledge-base";
import { createKnowledgeBase, listKnowledgeBase } from "@/services/knowledge-base";
import { semanticSearch } from "@/services/rag";

export async function GET(request: Request) {
  try {
    await assertRateLimit(request);
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    if (q) {
      return ok(await semanticSearch(q));
    }

    return ok(await listKnowledgeBase());
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await assertRateLimit(request);
    const input = createKnowledgeBaseSchema.parse(await request.json());

    return created(await createKnowledgeBase(input));
  } catch (error) {
    return apiError(error);
  }
}
