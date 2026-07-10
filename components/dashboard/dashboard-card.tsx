import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DashboardCard({
  title,
  description,
  children,
  className
}: {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border bg-card p-5 text-card-foreground shadow-sm", className)}>
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
