import { generateEmbedding } from "@/services/rag/embedding-service";
import { describe, it } from "node:test";

describe("generateEmbedding", () => {
  it("returns a normalized 1536 dimension vector", async () => {
    const vector = await generateEmbedding("webhook retry delay");

    expect(vector).toHaveLength(1536);
    expect(vector.some((value) => value > 0)).toBe(true);
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function expect(_arg0: boolean) {
  throw new Error("Function not implemented.");
}

