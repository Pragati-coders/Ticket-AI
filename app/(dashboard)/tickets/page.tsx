import { TicketList } from "@/components/tickets/ticket-list";

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Tickets</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage support requests across customers, agents, and teams.</p>
      </div>
      <TicketList />
    </div>
  );
}
