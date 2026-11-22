import { describe, it, expect, beforeAll } from "vitest";
import {
  createCheckoutSession,
  fulfillCheckoutSession,
  PRICING_TIERS,
} from "../src/lib/stripe";
import { prisma } from "../src/lib/prisma";

describe("Stripe Billing & Self-Serve Monetization Engine", () => {
  const testEmail = `tester_${Date.now()}@example.com`;

  it("exposes the correct pricing configuration for LTD ($49) and Pro ($19)", () => {
    expect(PRICING_TIERS.FOUNDER_LTD.price).toBe(49);
    expect(PRICING_TIERS.FOUNDER_LTD.priceInCents).toBe(4900);
    expect(PRICING_TIERS.PRO_MONTHLY.price).toBe(19);
    expect(PRICING_TIERS.PRO_MONTHLY.priceInCents).toBe(1900);
  });

  it("creates checkout session for Founder Lifetime Deal ($49)", async () => {
    const session = await createCheckoutSession({
      tier: "FOUNDER_LTD",
      email: testEmail,
      successUrl: "http://localhost:3000/checkout/success",
      cancelUrl: "http://localhost:3000/#pricing",
    });

    expect(session).toBeDefined();
    expect(session.id).toBeTruthy();
    expect(session.url).toBeTruthy();
    expect(session.url).toContain("session_id=");
  });

  it("creates checkout session for Pro Monthly ($19/mo)", async () => {
    const session = await createCheckoutSession({
      tier: "PRO",
      email: testEmail,
      successUrl: "http://localhost:3000/checkout/success",
      cancelUrl: "http://localhost:3000/#pricing",
    });

    expect(session).toBeDefined();
    expect(session.id).toBeTruthy();
    expect(session.url).toContain("tier=PRO");
  });

  it("fulfills mock checkout session and upgrades user tier", async () => {
    const session = await createCheckoutSession({
      tier: "FOUNDER_LTD",
      email: testEmail,
      successUrl: "http://localhost:3000/checkout/success",
      cancelUrl: "http://localhost:3000/#pricing",
    });

    const result = await fulfillCheckoutSession(session.id);
    expect(result.success).toBe(true);
    expect(result.tier).toBe("FOUNDER_LTD");

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    expect(user).toBeDefined();
    expect(user?.tier).toBe("FOUNDER_LTD");
  });
});
