import { errorResponse, readJson } from "../../../../lib/api.js";
import { checkSlidingWindow, checkTokenBucket } from "../../../../lib/rate-limiter.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const input = await readJson(request);
    const now = input.now ?? Date.now();

    return Response.json({
      token_bucket: checkTokenBucket({
        now,
        capacity: input.capacity ?? 10,
        refillPerSecond: input.refill_per_second ?? 1,
        previousTokens: input.previous_tokens ?? 10,
        previousRefillAt: input.previous_refill_at ?? now,
        cost: input.cost ?? 1,
      }),
      sliding_window: checkSlidingWindow({
        now,
        windowMs: input.window_ms ?? 60000,
        limit: input.limit ?? 10,
        timestamps: input.timestamps ?? [],
        cost: input.cost ?? 1,
      }),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
