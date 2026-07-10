import Anthropic from "@anthropic-ai/sdk";

export function getClaudeClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest";
