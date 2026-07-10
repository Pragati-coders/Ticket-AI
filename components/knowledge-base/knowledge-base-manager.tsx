"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Article = {
  id: string;
  title: string;
  department: string | null;
  status: string;
  _count?: { embeddings: number };
};

export function KnowledgeBaseManager({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = React.useState(initialArticles);
  const [results, setResults] = React.useState<Array<{ id: string; title: string; content: string; score: number }>>([]);
  const [isPending, startTransition] = React.useTransition();

  function createArticle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const response = await fetch("/api/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          content: formData.get("content"),
          department: formData.get("department"),
          status: "PUBLISHED"
        })
      });

      if (!response.ok) {
        toast.error("Knowledge-base article failed.");
        return;
      }

      const article = await response.json();
      setArticles([article, ...articles]);
      form.reset();
      toast.success("Article indexed.");
    });
  }

  function uploadDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    startTransition(async () => {
      const response = await fetch("/api/knowledge-base/upload", {
        method: "POST",
        body: new FormData(form)
      });

      if (!response.ok) {
        toast.error("Document upload failed.");
        return;
      }

      const article = await response.json();
      setArticles([article, ...articles]);
      form.reset();
      toast.success("Document parsed and indexed.");
    });
  }

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q")?.toString();
    if (!q) return;

    startTransition(async () => {
      const response = await fetch(`/api/knowledge-base?q=${encodeURIComponent(q)}`);
      setResults(await response.json());
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge base</CardTitle>
          <CardDescription>Published articles are chunked, embedded, and used by AI replies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={search} className="flex gap-2">
            <Input name="q" placeholder="Semantic search" />
            <Button type="submit" disabled={isPending}>Search</Button>
          </form>
          {results.length ? (
            <div className="space-y-3">
              {results.map((result) => (
                <article key={result.id} className="rounded-lg border p-3">
                  <p className="font-medium">{result.title}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{result.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Score {result.score.toFixed(2)}</p>
                </article>
              ))}
            </div>
          ) : null}
          <div className="grid gap-3">
            {articles.map((article) => (
              <article key={article.id} className="rounded-lg border p-4">
                <p className="font-medium">{article.title}</p>
                <p className="text-sm text-muted-foreground">
                  {article.department ?? "General"} · {article.status} · {article._count?.embeddings ?? 0} chunks
                </p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>New article</CardTitle>
            <CardDescription>Create indexed support guidance.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createArticle} className="grid gap-3">
              <Input name="title" placeholder="Title" required />
              <Input name="department" placeholder="Department" />
              <Textarea name="content" placeholder="Article content" required />
              <Button type="submit" disabled={isPending}>Publish and index</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upload document</CardTitle>
            <CardDescription>PDF and text documents are parsed into searchable chunks.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={uploadDocument} className="grid gap-3">
              <Input name="title" placeholder="Document title" />
              <Input name="department" placeholder="Department" />
              <Input name="file" type="file" accept=".pdf,.txt,.md,text/plain,application/pdf" required />
              <Button type="submit" disabled={isPending}>
                <Upload className="h-4 w-4" aria-hidden="true" />
                Upload
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
