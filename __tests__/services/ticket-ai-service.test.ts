import { classifyTicket } from "@/services/ai/ticket-ai-service";
import { describe, it } from "node:test";

describe("classifyTicket", () => {
  it("uses a deterministic fallback when Claude is not configured", async () => {
    const result = await classifyTicket({
      title: "Production outage",
      description: "The production API is down and customers cannot create tickets."
    });

    expect(result.priority).toBe("URGENT");
    expect(result.sentiment).toBe("NEGATIVE");
  });
});
function expect(priority: string) {
  throw new Error("Function not implemented.");
}

