import Stripe from "stripe";
import { prisma } from "./prisma";

export const PRICING_TIERS = {
  FOUNDER_LTD: {
    id: "FOUNDER_LTD",
    name: "Founder Lifetime Deal",
    price: 49,
    priceInCents: 4900,
    interval: "one-time",
    badge: "🔥 Early-Bird LTD (50 Spots)",
    description: "Pay once, keep forever. Unlimited viral LinkedIn carousels with zero watermarks.",
    features: [
      "Lifetime access to SocialStudio AI Studio",
      "Zero watermarks on all exported carousels",
      "Unlimited LinkedIn & Square carousels",
      "Full access to all 4 premium theme presets",
      "High-resolution vector PDF export (1080x1350)",
      "Companion Twitter/X thread generator",
      "Custom branding (name, handle, avatar)",
      "Priority Gemini AI generation pipeline",
    ],
  },
  PRO_MONTHLY: {
    id: "PRO",
    name: "SocialStudio Pro",
    price: 19,
    priceInCents: 1900,
    interval: "month",
    badge: "Most Flexible",
    description: "Monthly subscription for agile creators and growth agencies.",
    features: [
      "Watermark-free PDF downloads",
      "Unlimited carousels & slide generation",
      "All theme presets & custom colors",
      "LinkedIn & Square aspect ratios",
      "Companion Twitter/X threads",
      "Standard email support",
    ],
  },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia" as any,
  typescript: true,
});

export async function createCheckoutSession(params: {
  tier: "FOUNDER_LTD" | "PRO";
  email?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const isMock = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_mock" || process.env.STRIPE_SECRET_KEY.includes("mock");

  const tierConfig = params.tier === "FOUNDER_LTD" ? PRICING_TIERS.FOUNDER_LTD : PRICING_TIERS.PRO_MONTHLY;

  if (isMock) {
    const mockSessionId = `mock_session_${Date.now()}_${params.tier.toLowerCase()}`;
    // Save preliminary purchase record
    if (params.email) {
      const user = await prisma.user.upsert({
        where: { email: params.email },
        create: {
          email: params.email,
          tier: "FREE",
        },
        update: {},
      });

      await prisma.purchase.create({
        data: {
          stripeSessionId: mockSessionId,
          tier: params.tier,
          amount: tierConfig.priceInCents,
          currency: "usd",
          status: "pending",
          userId: user.id,
        },
      });
    }

    const separator = params.successUrl.includes("?") ? "&" : "?";
    return {
      id: mockSessionId,
      url: `${params.successUrl}${separator}session_id=${mockSessionId}&tier=${params.tier}`,
      isMock: true,
    };
  }

  // Real Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: params.email,
    mode: params.tier === "FOUNDER_LTD" ? "payment" : "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `SocialStudio AI — ${tierConfig.name}`,
            description: tierConfig.description,
          },
          unit_amount: tierConfig.priceInCents,
          ...(params.tier === "PRO" ? { recurring: { interval: "month" } } : {}),
        },
        quantity: 1,
      },
    ],
    metadata: {
      tier: params.tier,
      email: params.email || "",
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return {
    id: session.id,
    url: session.url,
    isMock: false,
  };
}

export async function fulfillCheckoutSession(sessionId: string) {
  // If mock session
  if (sessionId.startsWith("mock_session_")) {
    const tier = sessionId.includes("founder_ltd") ? "FOUNDER_LTD" : "PRO";
    const purchase = await prisma.purchase.findUnique({
      where: { stripeSessionId: sessionId },
      include: { user: true },
    });

    if (purchase && purchase.userId) {
      await prisma.user.update({
        where: { id: purchase.userId },
        data: { tier },
      });

      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "completed" },
      });

      return { success: true, tier, email: purchase.user?.email };
    }

    return { success: true, tier };
  }

  // Real Stripe Session fulfillment
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === "paid") {
    const tier = (session.metadata?.tier as "FOUNDER_LTD" | "PRO") || "FOUNDER_LTD";
    const email = session.customer_details?.email || session.metadata?.email;

    if (email) {
      const user = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          tier,
          stripeCustomerId: session.customer as string | undefined,
        },
        update: {
          tier,
          stripeCustomerId: session.customer as string | undefined,
        },
      });

      await prisma.purchase.upsert({
        where: { stripeSessionId: session.id },
        create: {
          stripeSessionId: session.id,
          tier,
          amount: session.amount_total || 4900,
          currency: session.currency || "usd",
          status: "completed",
          userId: user.id,
        },
        update: {
          status: "completed",
        },
      });

      return { success: true, tier, email };
    }
  }

  return { success: false, error: "Payment not verified" };
}
