import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">The page you requested is not available in TicketAI.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Return to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
