export const APP_ROLES = ["admin", "agent", "customer"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export type RoleRoute = {
  href: string;
  label: string;
  roles: AppRole[];
};
