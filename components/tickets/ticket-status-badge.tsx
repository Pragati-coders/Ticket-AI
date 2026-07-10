import { Badge } from "@/components/ui/badge";
import type { TicketPriority, TicketSentiment, TicketStatus } from "@/types";

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return <Badge variant={status === "OPEN" ? "default" : "secondary"}>{status.replaceAll("_", " ")}</Badge>;
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  return <Badge variant={priority === "URGENT" || priority === "HIGH" ? "destructive" : "outline"}>{priority}</Badge>;
}

export function TicketSentimentBadge({ sentiment }: { sentiment: TicketSentiment }) {
  return <Badge variant={sentiment === "NEGATIVE" ? "destructive" : "secondary"}>{sentiment}</Badge>;
}
