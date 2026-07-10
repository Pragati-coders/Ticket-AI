import { apiError, ok } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { classifyTicketSchema } from "@/lib/validation/ai";
import { classifyTicket, withRetry } from "@/services/ai";

export async function POST(request: Request) {
  try {
    await assertRateLimit(request);
    const input = classifyTicketSchema.parse(await request.json());

    return ok(await withRetry(() => classifyTicket(input)));
  } catch (error) {
    return apiError(error);
  }
}
