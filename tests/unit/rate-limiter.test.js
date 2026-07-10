import { describe, expect, test } from "vitest";
import { checkSlidingWindow, checkTokenBucket } from "../../lib/rate-limiter.js";

describe("rate limiter algorithms", () => {
  test("allows a token bucket request when enough tokens remain", () => {
    expect(
      checkTokenBucket({
        now: 10_000,
        capacity: 10,
        refillPerSecond: 1,
        previousTokens: 2,
        previousRefillAt: 9_000,
        cost: 2,
      }),
    ).toMatchObject({
      allowed: true,
      tokens_remaining: 1,
    });
  });

  test("denies a sliding-window request over the limit", () => {
    expect(
      checkSlidingWindow({
        now: 10_000,
        windowMs: 1_000,
        limit: 2,
        timestamps: [9_500, 9_700],
      }),
    ).toMatchObject({
      allowed: false,
      count: 2,
      retry_after_ms: 500,
    });
  });
});
