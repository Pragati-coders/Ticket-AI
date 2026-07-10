"use client";

import * as React from "react";
import { Bot, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TicketPriorityBadge, TicketSentimentBadge, TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type TicketDetailData = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  aiSuggestedReply: string | null;
  replies: Array<{
    id: string;
    body: string;
    isAiDraft: boolean;
    createdAt: string;
    author: { name: string | null; email: string; role: string };
  }>;
};

export function TicketDetail({ initialTicket }: { initialTicket: TicketDetailData }) {
  const router = useRouter();
  const [ticket, setTicket] = React.useState(initialTicket);
  const [reply, setReply] = React.useState("");
  const [aiReply, setAiReply] = React.useState(ticket.aiSuggestedReply ?? "");
  const [isPending, startTransition] = React.useTransition();

  function updateStatus(status: string) {
    const previous = ticket;
    setTicket({ ...ticket, status: status as TicketDetailData["status"] });

    startTransition(async () => {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        setTicket(previous);
        toast.error("Status update failed.");
        return;
      }

      toast.success("Ticket updated.");
    });
  }

  function sendReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch(`/api/tickets/${ticket.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply, visibility: "PUBLIC" })
      });

      if (!response.ok) {
        toast.error("Reply failed.");
        return;
      }

      const created = await response.json();
      setTicket({ ...ticket, replies: [...ticket.replies, created] });
      setReply("");
      toast.success("Reply sent.");
    });
  }

  function generateReply() {
    startTransition(async () => {
      const response = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticket.id, tone: "empathetic" })
      });

      if (!response.ok) {
        toast.error("AI reply failed.");
        return;
      }

      const data = (await response.json()) as { reply: string };
      setAiReply(data.reply);
      toast.success("AI reply drafted.");
    });
  }

  function deleteTicket() {
    const confirmed = window.confirm("Delete this ticket? This action cannot be undone.");

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        toast.error("Ticket could not be deleted.");
        return;
      }

      toast.success("Ticket deleted.");
      router.push("/tickets");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{ticket.title}</CardTitle>
              <CardDescription>{ticket.description}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
              <TicketSentimentBadge sentiment={ticket.sentiment} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticket.replies.map((item) => (
            <article key={item.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{item.author.name ?? item.author.email}</p>
                {item.isAiDraft ? <span className="text-xs text-muted-foreground">AI draft</span> : null}
              </div>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
          <form onSubmit={sendReply} className="space-y-3">
            <Textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply" required />
            <Button type="submit" disabled={isPending || reply.length < 2}>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send reply
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Workflow</CardTitle>
            <CardDescription>Update ticket state with optimistic feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={ticket.status} onChange={(event) => updateStatus(event.target.value)} aria-label="Ticket status">
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="WAITING_ON_CUSTOMER">Waiting on customer</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </Select>
            <Button type="button" variant="destructive" onClick={deleteTicket} disabled={isPending} className="w-full">
              Delete ticket
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI assistant</CardTitle>
            <CardDescription>Claude-powered response drafting with RAG context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={generateReply} disabled={isPending} className="w-full">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Draft reply
            </Button>
            {aiReply ? <p className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{aiReply}</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
