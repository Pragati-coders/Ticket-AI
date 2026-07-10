import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { requireRole } from "@/lib/auth/roles";
import { getAnalytics } from "@/services/analytics";

export default async function AnalyticsPage() {
  await requireRole(["admin", "agent"]);
  const data = await getAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">Measure support performance, AI adoption, and department load.</p>
      </div>
      <AnalyticsCharts data={data} />
    </div>
  );
}
