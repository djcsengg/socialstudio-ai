import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, TierKey } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawTier = (body.tier || "STARTER").toUpperCase();
    const validTiers: TierKey[] = ["STARTER", "FOUNDER_LTD", "BYOK", "PRO"];
    const tier: TierKey = validTiers.includes(rawTier) ? rawTier : "STARTER";

    const email = body.email?.trim() || "";
    const currency = body.currency === "inr" ? "inr" : "usd";

    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${origin}/checkout/success`;
    const cancelUrl = `${origin}/#pricing`;

    const session = await createCheckoutSession({
      tier,
      email,
      currency,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      isMock: session.isMock,
    });
  } catch (err: any) {
    console.error("Checkout session error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
