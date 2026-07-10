const EMBEDDING_DIMENSIONS = 1536;

export async function generateEmbedding(text: string) {
  const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
  const tokens = text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    const index = hashToken(token) % EMBEDDING_DIMENSIONS;
    vector[index] += 1;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;

  return vector.map((value) => Number((value / magnitude).toFixed(6)));
}

export function vectorToSql(vector: number[]) {
  return `[${vector.join(",")}]`;
}

function hashToken(token: string) {
  let hash = 2166136261;

  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash);
}
