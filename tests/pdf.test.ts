import { describe, it, expect } from "vitest";
import { generateCarouselPDF } from "../src/lib/pdf";
import { generateDeterministicCarousel } from "../src/lib/ai";
import { ThemeId, AspectRatio } from "../src/lib/types";

describe("High-Resolution Multi-Page PDF Export Engine", () => {
  const themes: ThemeId[] = [
    "modern_minimal",
    "dark_tech",
    "bold_gradient",
    "editorial_classic",
    "neo_brutalist",
    "emerald_growth",
    "crimson_bold",
    "nordic_frost",
  ];

  const aspectRatios: AspectRatio[] = ["4:5", "1:1"];

  themes.forEach((theme) => {
    aspectRatios.forEach((aspectRatio) => {
      it(`exports valid PDF for theme: ${theme} and aspect: ${aspectRatio}`, () => {
        const carousel = generateDeterministicCarousel({
          topic: "Building an Unstoppable Growth Flywheel",
          theme,
          aspectRatio,
        });

        const pdfBytes = generateCarouselPDF(carousel);

        expect(pdfBytes).toBeInstanceOf(Uint8Array);
        expect(pdfBytes.byteLength).toBeGreaterThan(1000);

        // Verify PDF Magic Header: %PDF-
        const header = String.fromCharCode(...pdfBytes.slice(0, 5));
        expect(header).toBe("%PDF-");
      });
    });
  });

  it("handles watermark toggle for free vs paid tiers", () => {
    const base = generateDeterministicCarousel({
      topic: "Watermark Verification Test",
    });

    const freeCarousel = { ...base, showWatermark: true };
    const paidCarousel = { ...base, showWatermark: false };

    const freeBytes = generateCarouselPDF(freeCarousel);
    const paidBytes = generateCarouselPDF(paidCarousel);

    expect(freeBytes.byteLength).toBeGreaterThan(0);
    expect(paidBytes.byteLength).toBeGreaterThan(0);
  });
});
