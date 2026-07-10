import { apiError, ok } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { updateTicketSchema } from "@/lib/validation/ticket";
import { getOrCreateCurrentUser } from "@/services/auth";
import { deleteTicket, getTicketById, updateTicket } from "@/services/tickets";

export async function GET(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  try {
    await assertRateLimit(request);
    const user = await getOrCreateCurrentUser();

    if (!user) {
      return apiError(new Error("Unauthorized"), 401);
    }

    const { ticketId } = await params;

    return ok(await getTicketById(ticketId, user));
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  try {
    await assertRateLimit(request);
    const user = await getOrCreateCurrentUser();

    if (!user) {
      return apiError(new Error("Unauthorized"), 401);
    }

    const { ticketId } = await params;
    const input = updateTicketSchema.parse(await request.json());

    return ok(await updateTicket(ticketId, input, user));
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  try {
    await assertRateLimit(request);
    const user = await getOrCreateCurrentUser();

    if (!user) {
      return apiError(new Error("Unauthorized"), 401);
    }

    const { ticketId } = await params;
    await deleteTicket(ticketId, user);

    return ok({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
