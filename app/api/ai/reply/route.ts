import { apiError, ok } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { generateReplySchema } from "@/lib/validation/ai";
import { generateAutoReply, withRetry } from "@/services/ai";

export async function POST(request: Request) {
  try {
    await assertRateLimit(request);
    const input = generateReplySchema.parse(await request.json());

    return ok({ reply: await withRetry(() => generateAutoReply(input.ticketId, input.tone)) });
  } catch (error) {
    return apiError(error);
  }
}
