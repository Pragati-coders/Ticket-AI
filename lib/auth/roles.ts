import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import type { AppRole } from "@/types/auth";

export const DEFAULT_ROLE: AppRole = "customer";

export function normalizeRole(role: unknown): AppRole {
  if (role === "admin" || role === "agent" || role === "customer") {
    return role;
  }

  return DEFAULT_ROLE;
}

export async function getCurrentRole(): Promise<AppRole> {
  const user = await currentUser();

  return normalizeRole(user?.publicMetadata?.role);
}

export async function requireAuthenticatedUser() {
  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireRole(allowedRoles: AppRole[]) {
  await requireAuthenticatedUser();
  const role = await getCurrentRole();

  if (!allowedRoles.includes(role)) {
    redirect("/dashboard");
  }

  return role;
}
