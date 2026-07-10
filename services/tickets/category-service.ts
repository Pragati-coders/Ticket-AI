import { prisma } from "@/lib/db/prisma";

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { tickets: true } } }
  });
}
