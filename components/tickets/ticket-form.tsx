"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function TicketForm({ onCreated }: { onCreated?: () => void }) {
  const [isPending, startTransition] = React.useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          priority: formData.get("priority"),
          department: formData.get("department")
        })
      });

      if (!response.ok) {
        toast.error("Ticket could not be created.");
        return;
      }

      form.reset();
      toast.success("Ticket created.");
      onCreated?.();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <Input name="title" placeholder="Ticket title" required minLength={3} />
      <Textarea name="description" placeholder="Describe the issue, impact, and expected outcome" required minLength={10} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select name="priority" defaultValue="MEDIUM" aria-label="Priority">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </Select>
        <Input name="department" placeholder="Department" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create ticket"}
      </Button>
    </form>
  );
}
