import { NextRequest, NextResponse } from "next/server";
import { generateCarouselWithAI } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { GenerateCarouselRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateCarouselRequest;

    if (!body.topic || !body.topic.trim()) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    const carousel = await generateCarouselWithAI(body);

    // Save to database
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
      console.warn("Could not persist carousel to SQLite, proceeding with memory state:", dbErr);
    }

    return NextResponse.json({
      success: true,
      carousel,
    });
  } catch (err: any) {
    console.error("Generate API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate carousel" },
      { status: 500 }
    );
  }
}
