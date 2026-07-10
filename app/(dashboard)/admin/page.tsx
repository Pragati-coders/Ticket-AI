import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { requireRole } from "@/lib/auth/roles";

export default async function AdminPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Administrative controls will be implemented in later milestones.</p>
      </div>
      <DashboardCard title="Admin access verified" description="Only users with the admin role can view this route." />
    </div>
  );
}
