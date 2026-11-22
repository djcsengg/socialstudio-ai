import { NextRequest, NextResponse } from "next/server";
import { generateCarouselPDF } from "@/lib/pdf";
import { CarouselData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { carousel: CarouselData };

    if (!body.carousel || !body.carousel.slides || body.carousel.slides.length === 0) {
      return NextResponse.json(
        { error: "Valid carousel with slides is required" },
        { status: 400 }
      );
    }

    const pdfBytes = generateCarouselPDF(body.carousel);
    const sanitizedTitle = (body.carousel.title || "carousel")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 50);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${sanitizedTitle}.pdf"`,
        "Content-Length": pdfBytes.byteLength.toString(),
      },
    });
  } catch (err: any) {
    console.error("PDF export error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
