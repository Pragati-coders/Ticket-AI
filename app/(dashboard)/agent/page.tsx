import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { requireRole } from "@/lib/auth/roles";

export default async function AgentPage() {
  await requireRole(["admin", "agent"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Agent</h1>
        <p className="mt-2 text-sm text-muted-foreground">Agent ticket operations will be implemented in later milestones.</p>
      </div>
      <DashboardCard title="Agent access verified" description="Admins and agents can view this protected route." />
    </div>
  );
}
