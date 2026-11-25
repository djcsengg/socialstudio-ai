import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../src/lib/rate-limit";

describe("Rate Limiting Engine", () => {
  it("allows up to 5 requests per minute for anonymous users", () => {
    const testIp = `anon_${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(testIp, false);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(4 - i);
    }

    const blocked = checkRateLimit(testIp, false);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("allows higher quota (20 requests/min) for authenticated/paid users", () => {
    const testUserId = `user_${Date.now()}`;
    for (let i = 0; i < 20; i++) {
      const res = checkRateLimit(testUserId, true);
      expect(res.success).toBe(true);
      expect(res.limit).toBe(20);
    }

    const blocked = checkRateLimit(testUserId, true);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
