import type { RoleRoute } from "@/types/auth";

export const protectedRoutes: RoleRoute[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["admin", "agent", "customer"]
  },
  {
    href: "/tickets",
    label: "Tickets",
    roles: ["admin", "agent", "customer"]
  },
  {
    href: "/knowledge-base",
    label: "Knowledge Base",
    roles: ["admin", "agent"]
  },
  {
    href: "/analytics",
    label: "Analytics",
    roles: ["admin", "agent"]
  },
  {
    href: "/notifications",
    label: "Notifications",
    roles: ["admin", "agent", "customer"]
  },
  {
    href: "/admin",
    label: "Admin",
    roles: ["admin"]
  },
  {
    href: "/agent",
    label: "Agent",
    roles: ["admin", "agent"]
  },
  {
    href: "/customer",
    label: "Customer",
    roles: ["admin", "agent", "customer"]
  }
];

export function getRoutesForRole(role: RoleRoute["roles"][number]) {
  return protectedRoutes.filter((route) => route.roles.includes(role));
}
