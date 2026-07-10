import { apiError, created } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { createKnowledgeBaseSchema } from "@/lib/validation/knowledge-base";
import { createKnowledgeBase } from "@/services/knowledge-base";
import { parseDocument } from "@/services/rag";

export async function POST(request: Request) {
  try {
    await assertRateLimit(request);
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return apiError(new Error("A document file is required."), 422);
    }

    const content = await parseDocument(file);
    const input = createKnowledgeBaseSchema.parse({
      title: formData.get("title")?.toString() || file.name,
      content,
      department: formData.get("department")?.toString(),
      status: "PUBLISHED"
    });

    return created(await createKnowledgeBase(input));
  } catch (error) {
    return apiError(error);
  }
}
