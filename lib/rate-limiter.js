export function checkTokenBucket({
  now,
  capacity,
  refillPerSecond,
  previousTokens,
  previousRefillAt,
  cost = 1,
}) {
  const elapsedSeconds = Math.max(0, (now - previousRefillAt) / 1000);
  const tokens = Math.min(capacity, previousTokens + elapsedSeconds * refillPerSecond);
  const allowed = tokens >= cost;

  return {
    allowed,
    tokens_remaining: allowed ? tokens - cost : tokens,
    retry_after_ms: allowed ? 0 : Math.ceil(((cost - tokens) / refillPerSecond) * 1000),
    refill_at: now,
  };
}

export function checkSlidingWindow({ now, windowMs, limit, timestamps, cost = 1 }) {
  const windowStart = now - windowMs;
  const activeTimestamps = timestamps.filter((timestamp) => timestamp > windowStart);
  const allowed = activeTimestamps.length + cost <= limit;

  return {
    allowed,
    count: allowed ? activeTimestamps.length + cost : activeTimestamps.length,
    timestamps: allowed
      ? [...activeTimestamps, ...Array.from({ length: cost }, () => now)]
      : activeTimestamps,
    retry_after_ms: allowed ? 0 : Math.max(0, activeTimestamps[0] + windowMs - now),
  };
}
