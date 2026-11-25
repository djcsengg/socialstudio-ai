export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate limiter (edge & serverless safe)
const ipRateLimits = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  ipRateLimits.forEach((record, key) => {
    if (now > record.resetTime) {
      ipRateLimits.delete(key);
    }
  });
}, 60000).unref?.();

/**
 * Check and enforce rate limits based on client identifier.
 * @param identifier IP address or user ID
 * @param isAuthenticated whether the user has a valid paid tier / account
 * @param windowMs window duration in milliseconds (default: 60s)
 */
export function checkRateLimit(
  identifier: string,
  isAuthenticated = false,
  windowMs = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const maxRequests = isAuthenticated ? 20 : 5;
  const key = `${isAuthenticated ? "auth" : "anon"}:${identifier}`;

  const current = ipRateLimits.get(key);

  if (!current || now > current.resetTime) {
    ipRateLimits.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (current.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: Math.ceil(current.resetTime / 1000),
    };
  }

  current.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - current.count,
    reset: Math.ceil(current.resetTime / 1000),
  };
}
