"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster richColors closeButton />
      </ThemeProvider>
    </ClerkProvider>
  );
}
