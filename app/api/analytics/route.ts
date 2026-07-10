import { apiError, ok } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { getAnalytics } from "@/services/analytics";

export async function GET(request: Request) {
  try {
    await assertRateLimit(request);

    return ok(await getAnalytics());
  } catch (error) {
    return apiError(error);
  }
}
