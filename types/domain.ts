export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketSentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type ReplyVisibility = "PUBLIC" | "INTERNAL";

export type TicketListItem = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  sentiment: TicketSentiment;
  department: string | null;
  createdAt: string;
  updatedAt: string;
  customer: { name: string | null; email: string };
  assignedAgent: { name: string | null; email: string } | null;
  category: { name: string; slug: string } | null;
  _count: { replies: number; attachments: number };
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
};
