import { KnowledgeBaseManager } from "@/components/knowledge-base/knowledge-base-manager";
import { requireRole } from "@/lib/auth/roles";
import { listKnowledgeBase } from "@/services/knowledge-base";

export default async function KnowledgeBasePage() {
  await requireRole(["admin", "agent"]);
  const articles = await listKnowledgeBase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Knowledge base</h1>
        <p className="mt-2 text-sm text-muted-foreground">Upload, index, and retrieve support knowledge for RAG.</p>
      </div>
      <KnowledgeBaseManager initialArticles={JSON.parse(JSON.stringify(articles))} />
    </div>
  );
}
