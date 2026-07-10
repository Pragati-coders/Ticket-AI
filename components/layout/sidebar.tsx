import Link from "next/link";
import { BarChart3, Bell, Bot, Building2, Gauge, Headphones, Library, ShieldCheck, Ticket } from "lucide-react";

import { getRoutesForRole } from "@/lib/auth/routes";
import type { AppRole } from "@/types/auth";

const routeIcons = {
  Dashboard: Gauge,
  Tickets: Ticket,
  "Knowledge Base": Library,
  Analytics: BarChart3,
  Notifications: Bell,
  Admin: ShieldCheck,
  Agent: Headphones,
  Customer: Building2
};

export function Sidebar({ role }: { role: AppRole }) {
  const routes = getRoutesForRole(role);

  return (
    <aside className="hidden min-h-screen w-64 border-r bg-background px-4 py-5 lg:block">
      <Link href="/dashboard" className="flex items-center gap-2 px-2 text-lg font-semibold">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        TicketAI
      </Link>
      <nav className="mt-8 space-y-1" aria-label="Main navigation">
        {routes.map((route) => {
          const Icon = routeIcons[route.label as keyof typeof routeIcons] ?? Gauge;

          return (
            <Link
              key={route.href}
              href={route.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {route.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
