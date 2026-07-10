import { apiError } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { generateReplySchema } from "@/lib/validation/ai";
import { streamAutoReply } from "@/services/ai";

export async function POST(request: Request) {
  try {
    await assertRateLimit(request);
    const input = generateReplySchema.parse(await request.json());
    const stream = await streamAutoReply(input.ticketId);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    return apiError(error);
  }
}
