import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { requireRole } from "@/lib/auth/roles";

export default async function CustomerPage() {
  await requireRole(["admin", "agent", "customer"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Customer</h1>
        <p className="mt-2 text-sm text-muted-foreground">Customer support workflows will be implemented in later milestones.</p>
      </div>
      <DashboardCard title="Customer access verified" description="Authenticated workspace access is active." />
    </div>
  );
}
