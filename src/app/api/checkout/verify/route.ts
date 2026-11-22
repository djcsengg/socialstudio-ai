import { NextRequest, NextResponse } from "next/server";
import { fulfillCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    const result = await fulfillCheckoutSession(sessionId);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Verification error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}
