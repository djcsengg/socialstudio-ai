import { NextRequest, NextResponse } from "next/server";
import { stripe, fulfillCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event;

    if (webhookSecret && sig && webhookSecret !== "whsec_mock") {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // In local/test mode without signature validation
      event = JSON.parse(rawBody);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await fulfillCheckoutSession(session.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }
}
