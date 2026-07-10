import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { getCurrentRole } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const user = await currentUser();
  const role = await getCurrentRole();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your secure {role} workspace is ready for the next TicketAI milestone.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Authentication" description="Clerk sessions, route protection, and user profile controls." />
        <DashboardCard title="Ticket operations" description="CRUD, search, sorting, filters, pagination, and AI replies.">
          <Button asChild variant="outline" size="sm">
            <Link href="/tickets">Open tickets</Link>
          </Button>
        </DashboardCard>
        <DashboardCard title="AI knowledge" description="Claude services, RAG, pgvector search, and analytics are available.">
          <Button asChild variant="outline" size="sm">
            <Link href={role === "customer" ? "/customer" : "/analytics"}>View workspace</Link>
          </Button>
        </DashboardCard>
      </div>
    </div>
  );
}
