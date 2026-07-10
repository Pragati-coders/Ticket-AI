"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace error</CardTitle>
        <CardDescription>The dashboard could not load this view.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset}>Retry</Button>
      </CardContent>
    </Card>
  );
}
