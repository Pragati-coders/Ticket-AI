import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">TicketAI</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          AI-ready support operations for modern teams
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Milestone 1 establishes the secure application shell. Ticket, AI, analytics, and RAG features arrive in later
          approved milestones.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-up">Create account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
