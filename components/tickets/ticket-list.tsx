"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { TicketForm } from "@/components/tickets/ticket-form";
import { TicketPriorityBadge, TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PaginatedResponse, TicketListItem } from "@/types";

export function TicketList() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [sort, setSort] = React.useState("createdAt");
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<PaginatedResponse<TicketListItem> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadTickets = React.useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), sort, order: "desc" });
    if (query) params.set("q", query);
    if (status) params.set("status", status);

    const response = await fetch(`/api/tickets?${params.toString()}`);
    if (!response.ok) {
      toast.error("Unable to load tickets.");
      setIsLoading(false);
      return;
    }

    setData(await response.json());
    setIsLoading(false);
  }, [page, query, sort, status]);

  React.useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Search, filter, sort, and triage support work.</CardDescription>
          <div className="grid gap-3 pt-3 md:grid-cols-3">
            <Input placeholder="Search tickets" value={query} onChange={(event) => setQuery(event.target.value)} />
            <Select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="WAITING_ON_CUSTOMER">Waiting</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </Select>
            <Select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort tickets">
              <option value="createdAt">Newest</option>
              <option value="updatedAt">Recently updated</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <Link href={`/tickets/${ticket.id}`} className="font-medium hover:underline">
                          {ticket.title}
                        </Link>
                        <p className="line-clamp-1 text-xs text-muted-foreground">{ticket.description}</p>
                      </TableCell>
                      <TableCell>
                        <TicketStatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        <TicketPriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>{ticket.assignedAgent?.name ?? "Unassigned"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{data?.meta.total ?? 0} tickets</p>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!data || page >= data.meta.pageCount}
                    onClick={() => setPage((value) => value + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>New ticket</CardTitle>
          <CardDescription>Optimistic workflow with toast feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketForm onCreated={loadTickets} />
        </CardContent>
      </Card>
    </div>
  );
}
