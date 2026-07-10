# TicketAI Deployment Guide

## 1. Supabase

1. Create a Supabase project.
2. Enable the `vector` extension in SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. Copy the pooled database URL into `DATABASE_URL`.
4. Copy the direct database URL into `DIRECT_URL`.

## 2. Clerk

Create a Clerk application and configure:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Set user public metadata:

```json
{ "role": "admin" }
```

## 3. AI and Security

```bash
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-3-5-sonnet-latest
ARCJET_KEY=
```

## 4. Database

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

## 5. Vercel

1. Import the repository.
2. Add all environment variables.
3. Use the included `vercel.json` build command.
4. Deploy.
