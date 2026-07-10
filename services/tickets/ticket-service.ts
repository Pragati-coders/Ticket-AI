import { Prisma, Role, TicketStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import type { CreateReplyInput, CreateTicketInput, TicketQueryInput, UpdateTicketInput } from "@/lib/validation/ticket";

const ticketInclude = {
  customer: { select: { name: true, email: true } },
  assignedAgent: { select: { name: true, email: true } },
  category: { select: { name: true, slug: true } },
  _count: { select: { replies: true, attachments: true } }
} satisfies Prisma.TicketInclude;

export async function listTickets(input: TicketQueryInput, user: { id: string; role: Role }) {
  const where: Prisma.TicketWhereInput = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.priority ? { priority: input.priority } : {}),
    ...(input.categoryId ? { categoryId: input.categoryId } : {}),
    ...(input.q
      ? {
          OR: [
            { title: { contains: input.q, mode: "insensitive" } },
            { description: { contains: input.q, mode: "insensitive" } },
            { department: { contains: input.q, mode: "insensitive" } }
          ]
        }
      : {})
  };

  if (user.role === Role.CUSTOMER) {
    where.customerId = user.id;
  }

  if (user.role === Role.AGENT) {
    where.OR = [{ assignedAgentId: user.id }, { assignedAgentId: null }, ...(Array.isArray(where.OR) ? where.OR : [])];
  }

  const skip = (input.page - 1) * input.pageSize;
  const [data, total] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      include: ticketInclude,
      orderBy: { [input.sort]: input.order },
      skip,
      take: input.pageSize
    }),
    prisma.ticket.count({ where })
  ]);

  return {
    data,
    meta: {
      page: input.page,
      pageSize: input.pageSize,
      total,
      pageCount: Math.ceil(total / input.pageSize)
    }
  };
}

export async function getTicketById(ticketId: string, user: { id: string; role: Role }) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      ...(user.role === Role.CUSTOMER ? { customerId: user.id } : {})
    },
    include: {
      ...ticketInclude,
      replies: {
        include: { author: { select: { name: true, email: true, role: true } } },
        orderBy: { createdAt: "asc" }
      },
      attachments: true,
      logs: { orderBy: { createdAt: "desc" }, take: 20 }
    }
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  return ticket;
}

export async function createTicket(input: CreateTicketInput, userId: string) {
  return prisma.ticket.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      categoryId: input.categoryId,
      department: input.department,
      customerId: userId,
      logs: {
        create: {
          action: "ticket.created",
          entity: "Ticket",
          entityId: "pending",
          userId
        }
      }
    },
    include: ticketInclude
  });
}

export async function updateTicket(ticketId: string, input: UpdateTicketInput, user: { id: string; role: Role }) {
  await getTicketById(ticketId, user);

  const resolvedAt = input.status === TicketStatus.RESOLVED || input.status === TicketStatus.CLOSED ? new Date() : undefined;

  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      ...input,
      resolvedAt,
      logs: {
        create: {
          action: "ticket.updated",
          entity: "Ticket",
          entityId: ticketId,
          userId: user.id,
          metadata: input
        }
      }
    },
    include: ticketInclude
  });
}

export async function deleteTicket(ticketId: string, user: { id: string; role: Role }) {
  await getTicketById(ticketId, user);

  return prisma.ticket.delete({ where: { id: ticketId } });
}

export async function addReply(ticketId: string, input: CreateReplyInput, user: { id: string; role: Role }) {
  await getTicketById(ticketId, user);

  return prisma.reply.create({
    data: {
      ticketId,
      authorId: user.id,
      body: input.body,
      visibility: input.visibility,
      isAiDraft: input.isAiDraft
    },
    include: { author: { select: { name: true, email: true, role: true } } }
  });
}
