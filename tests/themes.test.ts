import { describe, it, expect } from "vitest";
import { THEMES, FRAMEWORKS } from "../src/lib/themes";

describe("Theme Presets & Framework Definitions", () => {
  it("defines all 8 required theme presets", () => {
    expect(Object.keys(THEMES)).toHaveLength(8);
    expect(THEMES.modern_minimal).toBeDefined();
    expect(THEMES.dark_tech).toBeDefined();
    expect(THEMES.bold_gradient).toBeDefined();
    expect(THEMES.editorial_classic).toBeDefined();
    expect(THEMES.neo_brutalist).toBeDefined();
    expect(THEMES.emerald_growth).toBeDefined();
    expect(THEMES.crimson_bold).toBeDefined();
    expect(THEMES.nordic_frost).toBeDefined();
  });

  it("each theme has valid PDF RGB colors and container classes", () => {
    Object.values(THEMES).forEach((theme) => {
      expect(theme.name).toBeTruthy();
      expect(theme.containerClass).toBeTruthy();
      expect(theme.pdf.bg).toBeDefined();
      expect(theme.pdf.bg.r).toBeGreaterThanOrEqual(0);
      expect(theme.pdf.bg.g).toBeGreaterThanOrEqual(0);
      expect(theme.pdf.bg.b).toBeGreaterThanOrEqual(0);
      expect(theme.pdf.accent).toBeDefined();
      expect(theme.pdf.textPrimary).toBeDefined();
      expect(theme.pdf.fontFamily).toBeTruthy();
    });
  });

  it("defines all 5 conversion frameworks", () => {
    expect(FRAMEWORKS.length).toBe(5);
    const ids = FRAMEWORKS.map((f) => f.id);
    expect(ids).toContain("story");
    expect(ids).toContain("step_by_step");
    expect(ids).toContain("myth_vs_fact");
    expect(ids).toContain("contrarian");
    expect(ids).toContain("listicle");
  });
});
