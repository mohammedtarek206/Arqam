type RateLimitRecord = {
  count: number;
  lastReset: number;
};

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Simple in-memory rate limiter
 * @param identifier Unique identifier for the client (e.g. IP address)
 * @param limit Number of allowed requests in the window
 * @param windowMs Time window in milliseconds
 * @returns boolean True if limit exceeded
 */
export function isRateLimited(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000 // Default 1 minute
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return false;
  }

  record.count++;
  if (record.count > limit) {
    return true;
  }

  return false;
}
