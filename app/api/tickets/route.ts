import { apiError, created, ok } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { createTicketSchema, ticketQuerySchema } from "@/lib/validation/ticket";
import { getOrCreateCurrentUser } from "@/services/auth";
import { createTicket, listTickets } from "@/services/tickets";

export async function GET(request: Request) {
  try {
    await assertRateLimit(request);
    const user = await getOrCreateCurrentUser();

    if (!user) {
      return apiError(new Error("Unauthorized"), 401);
    }

    const params = Object.fromEntries(new URL(request.url).searchParams);
    const query = ticketQuerySchema.parse(params);

    return ok(await listTickets(query, user));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await assertRateLimit(request);
    const user = await getOrCreateCurrentUser();

    if (!user) {
      return apiError(new Error("Unauthorized"), 401);
    }

    const input = createTicketSchema.parse(await request.json());

    return created(await createTicket(input, user.id));
  } catch (error) {
    return apiError(error);
  }
}
