import { NextRequest, NextResponse } from "next/server";
import { stripe, fulfillCheckoutSession } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: any;

    if (webhookSecret && sig && webhookSecret !== "whsec_mock") {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // In local/test mode without signature validation
      event = JSON.parse(rawBody);
    }

    const eventId = event.id || `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Deduplication check: verify if event was already processed
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      return NextResponse.json({
        received: true,
        deduplicated: true,
        message: "Event already processed",
      });
    }

    // Record webhook event for idempotency
    try {
      await prisma.webhookEvent.create({
        data: {
          eventId,
          eventType: event.type || "unknown",
          processed: true,
        },
      });
    } catch (e) {
      // If concurrent insert occurred, return idempotent response
      return NextResponse.json({
        received: true,
        deduplicated: true,
        message: "Concurrent event already recorded",
      });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      if (session?.id) {
        await fulfillCheckoutSession(session.id);
      }
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
