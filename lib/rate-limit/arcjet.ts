import arcjet, { shield, tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY ?? "ajkey_dev_placeholder",
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 20
    })
  ]
});

export async function assertRateLimit(request: Request) {
  if (!process.env.ARCJET_KEY) {
    return;
  }

  const decision = await aj.protect(request);

  if (decision.isDenied()) {
    throw new Error("Too many requests. Please try again shortly.");
  }
}
