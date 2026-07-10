import { TicketDetail } from "@/components/tickets/ticket-detail";
import { getOrCreateCurrentUser } from "@/services/auth";
import { getTicketById } from "@/services/tickets";

export default async function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const user = await getOrCreateCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { ticketId } = await params;
  const ticket = await getTicketById(ticketId, user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ticket detail</h1>
        <p className="mt-2 text-sm text-muted-foreground">Collaborate with customers and AI on this support request.</p>
      </div>
      <TicketDetail initialTicket={JSON.parse(JSON.stringify(ticket))} />
    </div>
  );
}
