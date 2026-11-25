import Stripe from "stripe";
import { prisma } from "./prisma";

export type TierKey = "STARTER" | "FOUNDER_LTD" | "BYOK" | "PRO";

export interface TierConfig {
  id: TierKey;
  name: string;
  price: number;
  priceInCents: number;
  inrPrice: number;
  inrPriceInPaise: number;
  credits: number; // 35 for starter, 200 for founder, -1 for unlimited (byok/pro)
  interval: "one-time" | "month";
  badge?: string;
  description: string;
  features: string[];
}

export const PRICING_TIERS: Record<TierKey, TierConfig> = {
  STARTER: {
    id: "STARTER",
    name: "Creator Starter Pack",
    price: 9,
    priceInCents: 900,
    inrPrice: 499,
    inrPriceInPaise: 49900,
    credits: 35,
    interval: "one-time",
    badge: "⚡ 35 Generations ($9 / ₹499)",
    description: "35 high-res viral carousel exports. Perfect for founders launching on LinkedIn.",
    features: [
      "35 high-resolution carousel exports included",
      "Zero watermarks on all exported PDFs",
      "Full access to all 8 visual theme presets",
      "LinkedIn (4:5) & Square (1:1) aspect ratios",
      "Companion Twitter/X thread generator",
      "Instant client-side vector PDF downloads",
      "Priority Gemini 1.5 generation pipeline",
    ],
  },
  FOUNDER_LTD: {
    id: "FOUNDER_LTD",
    name: "Founder Lifetime Deal",
    price: 49,
    priceInCents: 4900,
    inrPrice: 1499,
    inrPriceInPaise: 149900,
    credits: 200,
    interval: "one-time",
    badge: "🔥 Early-Bird LTD (50 Spots)",
    description: "Pay once, keep forever. 200 generations/year with custom brand kit and zero watermarks.",
    features: [
      "Lifetime access to SocialStudio AI Studio",
      "200 high-converting generations per year",
      "Zero watermarks forever on all downloads",
      "All 8 visual theme presets unlocked",
      "High-resolution vector PDF export (1080x1350)",
      "Companion Twitter/X thread generator",
      "Custom brand kit (Avatar, Name, Handle)",
      "Priority Gemini AI generation pipeline",
      "Commercial usage & client export rights",
    ],
  },
  BYOK: {
    id: "BYOK",
    name: "BYOK (Bring Your Own Key)",
    price: 29,
    priceInCents: 2900,
    inrPrice: 999,
    inrPriceInPaise: 99900,
    credits: -1, // Unlimited with own key
    interval: "one-time",
    badge: "🛠️ Lifetime Software License",
    description: "Connect your own Gemini or OpenAI API key. Unlimited generations with zero credit limits.",
    features: [
      "Unlimited generations with your own API key",
      "Zero ongoing credit fees (100% margin software license)",
      "Zero watermarks on all PDF exports forever",
      "All 8 visual theme presets unlocked",
      "LinkedIn (4:5) and Square (1:1) exports",
      "Companion Twitter/X thread generator",
      "Local browser key storage (keys never stored on server)",
    ],
  },
  PRO: {
    id: "PRO",
    name: "SocialStudio Pro",
    price: 19,
    priceInCents: 1900,
    inrPrice: 999,
    inrPriceInPaise: 99900,
    credits: -1, // Unlimited subscription
    interval: "month",
    badge: "Flexible Monthly",
    description: "Monthly subscription for agile creators and growth agencies.",
    features: [
      "Unlimited monthly carousel generations",
      "Watermark-free high-res PDF downloads",
      "All 8 visual themes & custom branding",
      "Companion Twitter/X threads",
      "Priority email support",
      "Cancel anytime with 1 click",
      ],
      },
      };

      // Backwards compatibility alias
      (PRICING_TIERS as any).PRO_MONTHLY = PRICING_TIERS.PRO;

      const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia" as any,
  typescript: true,
});

export async function createCheckoutSession(params: {
  tier: TierKey;
  email?: string;
  currency?: "usd" | "inr";
  successUrl: string;
  cancelUrl: string;
}) {
  const isMock =
    !process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY === "sk_test_mock" ||
    process.env.STRIPE_SECRET_KEY.includes("mock");

  const tierConfig = PRICING_TIERS[params.tier] || PRICING_TIERS.STARTER;
  const currency = params.currency === "inr" ? "inr" : "usd";
  const amountInSmallestUnit =
    currency === "inr" ? tierConfig.inrPriceInPaise : tierConfig.priceInCents;

  if (isMock) {
    const mockSessionId = `mock_session_${Date.now()}_${params.tier.toLowerCase()}`;
    // Save preliminary purchase record
    if (params.email) {
      const user = await prisma.user.upsert({
        where: { email: params.email },
        create: {
          email: params.email,
          tier: "FREE",
          credits: 5,
        },
        update: {},
      });

      await prisma.purchase.create({
        data: {
          stripeSessionId: mockSessionId,
          tier: params.tier,
          amount: amountInSmallestUnit,
          currency,
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
    mode: params.tier === "PRO" ? "subscription" : "payment",
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `SocialStudio AI — ${tierConfig.name}`,
            description: tierConfig.description,
          },
          unit_amount: amountInSmallestUnit,
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
    const match = sessionId.match(/mock_session_\d+_([a-z_]+)/);
    const tierRaw = match ? match[1].toUpperCase() : "FOUNDER_LTD";
    const tier: TierKey =
      tierRaw === "STARTER"
        ? "STARTER"
        : tierRaw === "BYOK"
        ? "BYOK"
        : tierRaw === "PRO"
        ? "PRO"
        : "FOUNDER_LTD";

    const tierConfig = PRICING_TIERS[tier] || PRICING_TIERS.STARTER;

    const purchase = await prisma.purchase.findUnique({
      where: { stripeSessionId: sessionId },
      include: { user: true },
    });

    if (purchase && purchase.userId) {
      const addedCredits = tierConfig.credits > 0 ? tierConfig.credits : 999999;
      await prisma.user.update({
        where: { id: purchase.userId },
        data: {
          tier,
          credits: { increment: addedCredits },
        },
      });

      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "completed" },
      });

      return { success: true, tier, email: purchase.user?.email, creditsAdded: addedCredits };
    }

    return { success: true, tier };
  }

  // Real Stripe Session fulfillment
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === "paid") {
    const tier = (session.metadata?.tier as TierKey) || "STARTER";
    const tierConfig = PRICING_TIERS[tier] || PRICING_TIERS.STARTER;
    const email = session.customer_details?.email || session.metadata?.email;

    if (email) {
      const addedCredits = tierConfig.credits > 0 ? tierConfig.credits : 999999;

      const user = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          tier,
          credits: addedCredits,
          stripeCustomerId: session.customer as string | undefined,
        },
        update: {
          tier,
          credits: { increment: addedCredits },
          stripeCustomerId: session.customer as string | undefined,
        },
      });

      await prisma.purchase.upsert({
        where: { stripeSessionId: session.id },
        create: {
          stripeSessionId: session.id,
          tier,
          amount: session.amount_total || tierConfig.priceInCents,
          currency: session.currency || "usd",
          status: "completed",
          userId: user.id,
        },
        update: {
          status: "completed",
        },
      });

      return { success: true, tier, email, creditsAdded: addedCredits };
    }
  }

  return { success: false, error: "Payment not verified" };
}
