import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateCarouselWithAI } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const generateSchema = z.object({
  topic: z.string().min(1, "Topic is required").max(300, "Topic too long"),
  rawText: z.string().max(5000, "Content exceeds 5,000 characters").optional(),
  framework: z
    .enum(["story", "step_by_step", "myth_vs_fact", "contrarian", "listicle"])
    .optional(),
  aspectRatio: z.enum(["4:5", "1:1"]).optional(),
  theme: z
    .enum([
      "modern_minimal",
      "dark_tech",
      "bold_gradient",
      "editorial_classic",
      "neo_brutalist",
      "emerald_growth",
      "crimson_bold",
      "nordic_frost",
    ])
    .optional(),
  slideCount: z.number().int().min(3).max(10).optional(),
  authorName: z.string().max(60).optional(),
  authorHandle: z.string().max(60).optional(),
  userEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. IP & Rate Limiting Check
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    let rawBody: any;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // 2. Schema Validation
    const parsed = generateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }
    const body = parsed.data;

    // 3. User tier & Credit Resolution
    let user = null;
    let isPaidUser = false;

    if (body.userEmail) {
      user = await prisma.user.findUnique({
        where: { email: body.userEmail.toLowerCase().trim() },
      });
      if (user) {
        isPaidUser = user.tier !== "FREE";

        // If tier consumes credits (STARTER, FOUNDER_LTD), enforce credit balance
        if (user.tier === "STARTER" || user.tier === "FOUNDER_LTD") {
          if (user.credits <= 0) {
            return NextResponse.json(
              {
                success: false,
                error:
                  "You have used all your credits. Upgrade or top up with a Creator Starter pack ($9 for 35 credits).",
                needsTopup: true,
              },
              { status: 402 }
            );
          }
        }
      }
    }

    // Rate limit check: 20 req/min for paid accounts, 5 req/min for free/anonymous
    const rateLimit = checkRateLimit(user?.id || ip, isPaidUser);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rate limit exceeded (max 5 generations/min for anonymous users). Please wait a moment or sign in.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.reset - Math.floor(Date.now() / 1000)),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.reset),
          },
        }
      );
    }

    // 4. Atomic credit deduction before AI generation (if user has metered credits)
    if (user && (user.tier === "STARTER" || user.tier === "FOUNDER_LTD")) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: {
              decrement: 1,
            },
          },
        });
      } catch (creditErr) {
        console.warn("Could not decrement credits atomically:", creditErr);
      }
    }

    // 5. Generate with Gemini AI (fallback to deterministic engine if unavailable)
    const carousel = await generateCarouselWithAI(body);

    // If paid user, remove watermark
    if (isPaidUser) {
      carousel.showWatermark = false;
    }

    // 6. Persist Carousel to Database
    try {
      const saved = await prisma.carousel.create({
        data: {
          title: carousel.title,
          topic: carousel.topic,
          framework: carousel.framework,
          aspectRatio: carousel.aspectRatio,
          theme: carousel.theme,
          authorName: carousel.authorName,
          authorHandle: carousel.authorHandle,
          showWatermark: carousel.showWatermark,
          twitterThread: carousel.twitterThread,
          userId: user?.id,
          slides: {
            create: carousel.slides.map((s) => ({
              slideNumber: s.slideNumber,
              slideType: s.slideType,
              tagline: s.tagline,
              title: s.title,
              body: s.body,
              bulletPoints: JSON.stringify(s.bulletPoints || []),
              highlight: s.highlight,
            })),
          },
        },
      });

      carousel.id = saved.id;
    } catch (dbErr) {
      console.warn(
        "Could not persist carousel to SQLite, proceeding with memory state:",
        dbErr
      );
    }

    return NextResponse.json({
      success: true,
      carousel,
      remainingCredits: user && user.credits > 0 ? user.credits - 1 : undefined,
    });
  } catch (err: any) {
    console.error("Generate API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate carousel" },
      { status: 500 }
    );
  }
}
