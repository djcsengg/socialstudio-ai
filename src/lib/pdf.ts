import { jsPDF } from "jspdf";
import { THEMES } from "./themes";
import { CarouselData, ThemeConfig } from "./types";

export function generateCarouselPDF(carousel: CarouselData): Uint8Array {
  const isSquare = carousel.aspectRatio === "1:1";
  const width = 1080;
  const height = isSquare ? 1080 : 1350;

  const themeConfig: ThemeConfig = THEMES[carousel.theme] || THEMES.modern_minimal;
  const { pdf: p } = themeConfig;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [width, height],
    compress: true,
  });

  const totalSlides = carousel.slides.length;

  carousel.slides.forEach((slide, index) => {
    if (index > 0) {
      doc.addPage([width, height], "portrait");
    }

    // 1. Background fill
    doc.setFillColor(p.bg.r, p.bg.g, p.bg.b);
    doc.rect(0, 0, width, height, "F");

    // Subtle decorative border/frame
    doc.setDrawColor(p.border.r, p.border.g, p.border.b);
    doc.setLineWidth(2);
    doc.rect(40, 40, width - 80, height - 80, "S");

    // 2. Header Bar: Avatar, Author & Handle, Slide Counter
    const avatarX = 80;
    const avatarY = 100;
    const avatarRadius = 32;

    // Avatar Circle
    doc.setFillColor(p.accent.r, p.accent.g, p.accent.b);
    doc.circle(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, "F");

    // Initials
    const initials = (carousel.authorName || "SS")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(initials, avatarX + avatarRadius, avatarY + avatarRadius + 8, { align: "center" });

    // Author Name & Handle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(p.textPrimary.r, p.textPrimary.g, p.textPrimary.b);
    doc.text(carousel.authorName || "SocialStudio Creator", avatarX + avatarRadius * 2 + 20, avatarY + 28);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.setTextColor(p.textSecondary.r, p.textSecondary.g, p.textSecondary.b);
    doc.text(carousel.authorHandle || "@socialstudio", avatarX + avatarRadius * 2 + 20, avatarY + 54);

    // Slide Counter (Top Right)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(p.accent.r, p.accent.g, p.accent.b);
    const counterText = `${slide.slideNumber} / ${totalSlides}`;
    doc.text(counterText, width - 80, avatarY + 40, { align: "right" });

    // 3. Tagline / Badge
    let currentY = 220;
    if (slide.tagline) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      const tagText = slide.tagline.toUpperCase();
      const tagWidth = doc.getTextWidth(tagText) + 32;
      const tagHeight = 34;

      doc.setFillColor(p.highlightBg.r, p.highlightBg.g, p.highlightBg.b);
      doc.setDrawColor(p.accent.r, p.accent.g, p.accent.b);
      doc.roundedRect(80, currentY, tagWidth, tagHeight, 8, 8, "FD");

      doc.setTextColor(p.accent.r, p.accent.g, p.accent.b);
      doc.text(tagText, 80 + 16, currentY + 23);
      currentY += 60;
    }

    // 4. Slide Title
    doc.setFont(p.fontFamily === "times" ? "times" : "helvetica", "bold");
    doc.setFontSize(isSquare ? 46 : 52);
    doc.setTextColor(p.textPrimary.r, p.textPrimary.g, p.textPrimary.b);

    const titleMaxWidth = width - 160;
    const titleLines = doc.splitTextToSize(slide.title, titleMaxWidth);
    doc.text(titleLines, 80, currentY);
    currentY += titleLines.length * (isSquare ? 54 : 62) + 24;

    // 5. Body Text
    if (slide.body) {
      doc.setFont(p.fontFamily === "times" ? "times" : "helvetica", "normal");
      doc.setFontSize(isSquare ? 26 : 30);
      doc.setTextColor(p.textSecondary.r, p.textSecondary.g, p.textSecondary.b);

      const bodyLines = doc.splitTextToSize(slide.body, titleMaxWidth);
      doc.text(bodyLines, 80, currentY);
      currentY += bodyLines.length * (isSquare ? 36 : 42) + 32;
    }

    // 6. Bullet Points
    if (slide.bulletPoints && slide.bulletPoints.length > 0) {
      const maxBullets = isSquare ? 3 : 4;
      const bulletsToShow = slide.bulletPoints.slice(0, maxBullets);

      bulletsToShow.forEach((bullet) => {
        // Dot
        doc.setFillColor(p.accent.r, p.accent.g, p.accent.b);
        doc.circle(92, currentY - 8, 6, "F");

        // Bullet text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(isSquare ? 22 : 25);
        doc.setTextColor(p.textPrimary.r, p.textPrimary.g, p.textPrimary.b);

        const bLines = doc.splitTextToSize(bullet, width - 200);
        doc.text(bLines, 114, currentY);
        currentY += bLines.length * 34 + 14;
      });

      currentY += 20;
    }

    // 7. Highlight Box / Callout
    if (slide.highlight) {
      const boxWidth = width - 160;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(isSquare ? 22 : 24);
      const hLines = doc.splitTextToSize(`“${slide.highlight}”`, boxWidth - 50);
      const boxHeight = hLines.length * 32 + 36;

      // Ensure highlight box doesn't overlap footer
      const maxAllowedY = height - 160 - boxHeight;
      const highlightY = Math.min(currentY, maxAllowedY);

      // Card Background
      doc.setFillColor(p.highlightBg.r, p.highlightBg.g, p.highlightBg.b);
      doc.roundedRect(80, highlightY, boxWidth, boxHeight, 10, 10, "F");

      // Left Accent Border
      doc.setFillColor(p.accent.r, p.accent.g, p.accent.b);
      doc.rect(80, highlightY, 8, boxHeight, "F");

      // Text
      doc.setTextColor(p.textPrimary.r, p.textPrimary.g, p.textPrimary.b);
      doc.text(hLines, 110, highlightY + 30);
    }

    // 8. Footer: Swipe Indicator & Watermark
    const footerY = height - 80;

    // Divider Line
    doc.setDrawColor(p.border.r, p.border.g, p.border.b);
    doc.setLineWidth(1);
    doc.line(80, footerY - 30, width - 80, footerY - 30);

    // Left side: Watermark or Clean Branding
    if (carousel.showWatermark) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(p.accent.r, p.accent.g, p.accent.b);
      doc.text("⚡ Created with SocialStudio AI", 80, footerY);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.setTextColor(p.textSecondary.r, p.textSecondary.g, p.textSecondary.b);
      doc.text(carousel.title || "SocialStudio AI", 80, footerY);
    }

    // Right side: Swipe Indicator
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(p.textPrimary.r, p.textPrimary.g, p.textPrimary.b);
    const isLastSlide = index === totalSlides - 1;
    const swipeText = isLastSlide ? "DONE ✓" : "SWIPE ➔";
    doc.text(swipeText, width - 80, footerY, { align: "right" });
  });

  const arrayBuffer = doc.output("arraybuffer");
  return new Uint8Array(arrayBuffer);
}
