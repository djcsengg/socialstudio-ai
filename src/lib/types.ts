export type AspectRatio = "4:5" | "1:1";

export type FrameworkType =
  | "story"
  | "step_by_step"
  | "myth_vs_fact"
  | "contrarian"
  | "listicle";

export type ThemeId =
  | "modern_minimal"
  | "dark_tech"
  | "bold_gradient"
  | "editorial_classic"
  | "neo_brutalist"
  | "emerald_growth"
  | "crimson_bold"
  | "nordic_frost";

export type TierType = "FREE" | "STARTER" | "FOUNDER_LTD" | "BYOK" | "PRO";

export type SlideType = "hook" | "content" | "insight" | "takeaway" | "cta";

export interface SlideData {
  id?: string;
  slideNumber: number;
  slideType: SlideType;
  tagline?: string;
  title: string;
  body: string;
  bulletPoints?: string[];
  highlight?: string;
}

export interface CarouselData {
  id?: string;
  title: string;
  topic: string;
  framework: FrameworkType;
  aspectRatio: AspectRatio;
  theme: ThemeId;
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
  showWatermark: boolean;
  slides: SlideData[];
  twitterThread?: string;
  createdAt?: string;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  previewBg: string;
  containerClass: string;
  badgeClass: string;
  titleClass: string;
  bodyClass: string;
  highlightClass: string;
  bulletDotClass: string;
  footerClass: string;
  authorClass: string;
  pdf: {
    bg: RGBColor;
    bgSecondary?: RGBColor;
    cardBg: RGBColor;
    textPrimary: RGBColor;
    textSecondary: RGBColor;
    accent: RGBColor;
    highlightBg: RGBColor;
    border: RGBColor;
    fontFamily: string;
  };
}

export interface GenerateCarouselRequest {
  topic: string;
  rawText?: string;
  framework?: FrameworkType;
  aspectRatio?: AspectRatio;
  theme?: ThemeId;
  slideCount?: number;
  authorName?: string;
  authorHandle?: string;
}

export interface GenerateCarouselResponse {
  success: boolean;
  carousel: CarouselData;
  error?: string;
}
