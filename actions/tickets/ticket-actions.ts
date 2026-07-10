"use server";

import { revalidatePath } from "next/cache";

import { createTicketSchema, updateTicketSchema } from "@/lib/validation/ticket";
import { getOrCreateCurrentUser } from "@/services/auth";
import { createTicket, updateTicket } from "@/services/tickets";

export async function createTicketAction(input: unknown) {
  const user = await getOrCreateCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const ticket = await createTicket(createTicketSchema.parse(input), user.id);
  revalidatePath("/tickets");

  return ticket;
}

export async function updateTicketAction(ticketId: string, input: unknown) {
  const user = await getOrCreateCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const ticket = await updateTicket(ticketId, updateTicketSchema.parse(input), user);
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);

  return ticket;
}
