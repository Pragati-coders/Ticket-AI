import { subMonths } from "@/lib/date";
import { prisma } from "@/lib/db/prisma";

export async function getAnalytics() {
  const since = subMonths(new Date(), 6);
  const [ticketsByStatus, ticketsByDepartment, aiUsage, recentTickets] = await Promise.all([
    prisma.ticket.groupBy({ by: ["status"], _count: true }),
    prisma.ticket.groupBy({ by: ["department"], _count: true }),
    prisma.ticket.count({ where: { aiSuggestedReply: { not: null } } }),
    prisma.ticket.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, resolvedAt: true, department: true },
      orderBy: { createdAt: "asc" }
    })
  ]);

  const monthlyTickets = buildMonthlySeries(recentTickets.map((ticket: { createdAt: any; }) => ticket.createdAt));
  const resolved = recentTickets.filter((ticket: { resolvedAt: any; }) => ticket.resolvedAt);
  const averageResponseHours = resolved.length
    ? resolved.reduce((sum: number, ticket: { resolvedAt: { getTime: () => any; }; createdAt: { getTime: () => number; }; }) => sum + ((ticket.resolvedAt?.getTime() ?? 0) - ticket.createdAt.getTime()) / 3600000, 0) /
      resolved.length
    : 0;

  return {
    ticketsByStatus: ticketsByStatus.map((item: { status: any; _count: any; }) => ({ name: item.status, value: item._count })),
    ticketsByDepartment: ticketsByDepartment.map((item: { department: any; _count: any; }) => ({ name: item.department ?? "Unassigned", value: item._count })),
    monthlyTickets,
    averageResponseHours: Number(averageResponseHours.toFixed(1)),
    aiUsage
  };
}

function buildMonthlySeries(dates: Date[]) {
  const buckets = new Map<string, number>();
  const now = new Date();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = subMonths(now, offset);
    buckets.set(date.toLocaleString("en", { month: "short" }), 0);
  }

  for (const date of dates) {
    const key = date.toLocaleString("en", { month: "short" });
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([month, tickets]) => ({ month, tickets }));
}
