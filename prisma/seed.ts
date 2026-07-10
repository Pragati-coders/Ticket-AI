import { PrismaClient, Role, TicketPriority, TicketSentiment, TicketStatus, KnowledgeBaseStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [admin, agent, customer] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@ticketai.dev" },
      update: {},
      create: {
        clerkId: "seed_admin",
        email: "admin@ticketai.dev",
        name: "Avery Admin",
        role: Role.ADMIN,
        department: "Operations"
      }
    }),
    prisma.user.upsert({
      where: { email: "agent@ticketai.dev" },
      update: {},
      create: {
        clerkId: "seed_agent",
        email: "agent@ticketai.dev",
        name: "Alex Agent",
        role: Role.AGENT,
        department: "Technical Support"
      }
    }),
    prisma.user.upsert({
      where: { email: "customer@ticketai.dev" },
      update: {},
      create: {
        clerkId: "seed_customer",
        email: "customer@ticketai.dev",
        name: "Casey Customer",
        role: Role.CUSTOMER
      }
    })
  ]);

  const billing = await prisma.category.upsert({
    where: { slug: "billing" },
    update: {},
    create: {
      name: "Billing",
      slug: "billing",
      department: "Finance",
      description: "Invoices, renewals, and subscription questions."
    }
  });

  const technical = await prisma.category.upsert({
    where: { slug: "technical-support" },
    update: {},
    create: {
      name: "Technical Support",
      slug: "technical-support",
      department: "Technical Support",
      description: "Product defects, integrations, and troubleshooting."
    }
  });

  const ticket = await prisma.ticket.create({
    data: {
      title: "Webhook events are delayed",
      description:
        "Our production webhook delivery is delayed by 20 minutes and the retry dashboard does not show failures.",
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.HIGH,
      sentiment: TicketSentiment.NEGATIVE,
      department: "Technical Support",
      customerId: customer.id,
      assignedAgentId: agent.id,
      categoryId: technical.id,
      aiSummary: "Customer reports delayed production webhooks with unclear retry visibility."
    }
  });

  await prisma.reply.create({
    data: {
      ticketId: ticket.id,
      authorId: agent.id,
      body: "Thanks for the detail. We are checking the delivery queue and will update you shortly."
    }
  });

  await prisma.ticket.create({
    data: {
      title: "Need invoice for annual renewal",
      description: "Please send the paid invoice for our annual renewal to the finance contact on file.",
      status: TicketStatus.OPEN,
      priority: TicketPriority.MEDIUM,
      sentiment: TicketSentiment.NEUTRAL,
      department: "Finance",
      customerId: customer.id,
      assignedAgentId: admin.id,
      categoryId: billing.id
    }
  });

  const kb = await prisma.knowledgeBase.upsert({
    where: { slug: "webhook-troubleshooting" },
    update: {},
    create: {
      title: "Webhook Troubleshooting",
      slug: "webhook-troubleshooting",
      status: KnowledgeBaseStatus.PUBLISHED,
      department: "Technical Support",
      content:
        "Webhook delivery delays are usually caused by endpoint timeouts, invalid response codes, or queue backpressure. Check retry logs, endpoint health, signing secret rotation, and recent incident status before escalating."
    }
  });

  await prisma.log.create({
    data: {
      action: "seed.completed",
      entity: "System",
      entityId: "seed",
      userId: admin.id,
      metadata: { knowledgeBaseId: kb.id }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
