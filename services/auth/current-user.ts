import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { normalizeRole } from "@/lib/auth/roles";

const roleMap = {
  admin: Role.ADMIN,
  agent: Role.AGENT,
  customer: Role.CUSTOMER
} as const;

export async function getOrCreateCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Authenticated Clerk user is missing a primary email address.");
  }

  const role = roleMap[normalizeRole(clerkUser.publicMetadata.role)];

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
      role
    },
    create: {
      clerkId: clerkUser.id,
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
      role
    }
  });
}
