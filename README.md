# TicketAI

TicketAI is a production-ready SaaS support platform built with Next.js 15 App Router, TypeScript, TailwindCSS, shadcn/ui-style components, Prisma, PostgreSQL/Supabase, Clerk Authentication, Claude API, pgvector, Arcjet, Jest, GitHub Actions, Docker, and Vercel.

## Features

- Clerk authentication with protected routes and role-aware navigation
- Admin, agent, and customer route boundaries
- Ticket CRUD with search, sorting, filtering, pagination, loading skeletons, optimistic UI, and toast notifications
- Replies, internal workflow status changes, assignment-ready schema, attachments-ready schema
- Claude-powered ticket classification, priority detection, sentiment analysis, department routing, auto replies, tool/function calling, retries, streaming endpoint, and error handling
- RAG pipeline with document parsing, chunking, deterministic development embeddings, pgvector storage, semantic search, and Claude retrieval context
- Knowledge-base upload and manual article creation
- Analytics dashboard with monthly tickets, response times, departments, AI usage, dark mode, and responsive charts
- Prisma schema, SQL migration, seed data, and Supabase-ready pgvector setup
- Arcjet request protection
- Jest tests, GitHub Actions CI, Docker, Vercel config, SEO metadata, sitemap, robots.txt, and deployment guide

## Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- shadcn/ui conventions
- Prisma
- PostgreSQL/Supabase
- Clerk
- Claude API via `@anthropic-ai/sdk`
- pgvector
- Arcjet
- Jest
- GitHub Actions
- Docker
- Vercel

## Getting Started

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
DATABASE_URL=""
DIRECT_URL=""
ANTHROPIC_API_KEY=""
CLAUDE_MODEL="claude-3-5-sonnet-latest"
ARCJET_KEY=""
```

For Supabase, use the pooled connection string for `DATABASE_URL` and the direct database connection for `DIRECT_URL`.

## Clerk Roles

Set Clerk public metadata:

```json
{
  "role": "admin"
}
```

Supported values are `admin`, `agent`, and `customer`. Users without metadata default to `customer`.

## Project Structure

```text
app/                App Router pages, layouts, API route handlers, SEO routes
components/         Reusable UI, dashboard, ticket, analytics, knowledge-base components
hooks/              Shared React hooks
lib/                Auth helpers, Prisma client, validation, rate limiting, SEO, utilities
services/           Clean application services for tickets, AI, RAG, analytics, notifications
actions/            Server actions for workflow entry points
types/              Shared TypeScript domain types
api/                API adapter documentation and boundary notes
prisma/             Prisma schema, migration SQL, seed data
public/             Public assets
styles/             Reserved shared style modules
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:ci
npm run prisma:migrate
npm run db:seed
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md).
