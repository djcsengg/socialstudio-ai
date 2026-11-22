import { describe, it, expect } from "vitest";
import { generateDeterministicCarousel } from "../src/lib/ai";
import { FrameworkType } from "../src/lib/types";

describe("AI Content Generation Pipeline", () => {
  const frameworks: FrameworkType[] = [
    "story",
    "step_by_step",
    "myth_vs_fact",
    "contrarian",
    "listicle",
  ];

  frameworks.forEach((fw) => {
    it(`generates structured carousel for framework: ${fw}`, () => {
      const carousel = generateDeterministicCarousel({
        topic: "Scaling an AI Micro-SaaS to $10k/month",
        framework: fw,
        aspectRatio: "4:5",
        theme: "modern_minimal",
        authorName: "Sarah Connor",
        authorHandle: "@sarahconnor",
      });

      expect(carousel).toBeDefined();
      expect(carousel.topic).toBe("Scaling an AI Micro-SaaS to $10k/month");
      expect(carousel.framework).toBe(fw);
      expect(carousel.aspectRatio).toBe("4:5");
      expect(carousel.slides.length).toBeGreaterThanOrEqual(4);

      // Verify Slide 1 is Hook
      const hookSlide = carousel.slides[0];
      expect(hookSlide.slideNumber).toBe(1);
      expect(hookSlide.slideType).toBe("hook");
      expect(hookSlide.title).toBeTruthy();
      expect(hookSlide.body).toBeTruthy();

      // Verify Last Slide is CTA
      const lastSlide = carousel.slides[carousel.slides.length - 1];
      expect(lastSlide.slideType).toBe("cta");

      // Verify companion Twitter thread
      expect(carousel.twitterThread).toBeTruthy();
      expect(carousel.twitterThread).toContain("🧵");
      expect(carousel.twitterThread).toContain("@sarahconnor");
    });
  });

  it("handles custom author name and handle correctly", () => {
    const carousel = generateDeterministicCarousel({
      topic: "High Leverage Systems",
      authorName: "Marcus Vance",
      authorHandle: "@marcusv",
    });

    expect(carousel.authorName).toBe("Marcus Vance");
    expect(carousel.authorHandle).toBe("@marcusv");
    expect(carousel.twitterThread).toContain("@marcusv");
  });
});
