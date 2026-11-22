"use client";

import React from "react";
import { SlideData, ThemeId, AspectRatio } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import clsx from "clsx";
import { ArrowRight, Check } from "lucide-react";

interface SlidePreviewProps {
  slide: SlideData;
  theme: ThemeId;
  aspectRatio: AspectRatio;
  authorName?: string;
  authorHandle?: string;
  showWatermark?: boolean;
  totalSlides: number;
  className?: string;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({
  slide,
  theme,
  aspectRatio,
  authorName = "Alex Mercer",
  authorHandle = "@alexmercer",
  showWatermark = true,
  totalSlides,
  className,
}) => {
  const themeConfig = THEMES[theme] || THEMES.modern_minimal;
  const isSquare = aspectRatio === "1:1";

  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isLast = slide.slideNumber === totalSlides;

  return (
    <div
      className={clsx(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl select-none transition-all p-8 md:p-10",
        isSquare ? "aspect-square" : "aspect-[4/5]",
        themeConfig.containerClass,
        className
      )}
      style={{
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Top Header: Author + Pagination */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-sm shrink-0">
            {initials}
          </div>
          <div>
            <p className={clsx("text-sm md:text-base font-bold leading-tight", themeConfig.authorClass)}>
              {authorName}
            </p>
            <p className="text-xs md:text-sm text-slate-400 font-medium">
              {authorHandle}
            </p>
          </div>
        </div>

        {/* Counter */}
        <div className="px-3 py-1 rounded-full text-xs md:text-sm font-bold bg-black/5 dark:bg-white/10 backdrop-blur-sm">
          {slide.slideNumber} / {totalSlides}
        </div>
      </div>

      {/* Slide Core Content */}
      <div className="my-auto py-4 space-y-4 md:space-y-6">
        {/* Tagline / Category Badge */}
        {slide.tagline && (
          <div className="inline-block">
            <span
              className={clsx(
                "px-3 py-1 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider",
                themeConfig.badgeClass
              )}
            >
              {slide.tagline}
            </span>
          </div>
        )}

        {/* Headline / Title */}
        <h2
          className={clsx(
            "leading-tight",
            isSquare ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl",
            themeConfig.titleClass
          )}
        >
          {slide.title}
        </h2>

        {/* Body Paragraph */}
        {slide.body && (
          <p
            className={clsx(
              "text-sm md:text-base leading-relaxed font-normal",
              themeConfig.bodyClass
            )}
          >
            {slide.body}
          </p>
        )}

        {/* Bullet Points */}
        {slide.bulletPoints && slide.bulletPoints.length > 0 && (
          <ul className="space-y-2 md:space-y-2.5 pt-1">
            {slide.bulletPoints.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm font-medium">
                <span
                  className={clsx(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    themeConfig.bulletDotClass
                  )}
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Highlight Callout Box */}
        {slide.highlight && (
          <div
            className={clsx(
              "p-3.5 md:p-4 rounded-xl text-xs md:text-sm font-medium",
              themeConfig.highlightClass
            )}
          >
            "{slide.highlight}"
          </div>
        )}
      </div>

      {/* Footer Bar: Watermark + Swipe Indicator */}
      <div
        className={clsx(
          "pt-4 flex items-center justify-between text-xs md:text-sm font-semibold",
          themeConfig.footerClass
        )}
      >
        {/* Watermark or custom branding */}
        <div>
          {showWatermark ? (
            <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-cyan-400">
              ⚡ Created with SocialStudio AI
            </span>
          ) : (
            <span className="opacity-60">{authorHandle}</span>
          )}
        </div>

        {/* Swipe cue */}
        <div className="flex items-center gap-1 opacity-80 uppercase tracking-wider text-[11px] md:text-xs">
          <span>{isLast ? "DONE" : "SWIPE"}</span>
          {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </div>
      </div>
    </div>
  );
};
