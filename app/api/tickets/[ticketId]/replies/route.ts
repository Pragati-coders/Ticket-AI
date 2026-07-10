import { apiError, created } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { createReplySchema } from "@/lib/validation/ticket";
import { getOrCreateCurrentUser } from "@/services/auth";
import { addReply } from "@/services/tickets";

export async function POST(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  try {
    await assertRateLimit(request);
    const user = await getOrCreateCurrentUser();

    if (!user) {
      return apiError(new Error("Unauthorized"), 401);
    }

    const { ticketId } = await params;
    const input = createReplySchema.parse(await request.json());

    return created(await addReply(ticketId, input, user));
  } catch (error) {
    return apiError(error);
  }
}
