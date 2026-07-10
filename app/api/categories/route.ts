import { apiError, ok } from "@/lib/api-response";
import { assertRateLimit } from "@/lib/rate-limit/arcjet";
import { listCategories } from "@/services/tickets";

export async function GET(request: Request) {
  try {
    await assertRateLimit(request);

    return ok(await listCategories());
  } catch (error) {
    return apiError(error);
  }
}
