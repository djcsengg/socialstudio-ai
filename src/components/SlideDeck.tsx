"use client";

import React, { useState } from "react";
import { CarouselData, SlideData, ThemeId, AspectRatio } from "@/lib/types";
import { SlidePreview } from "./SlidePreview";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  Download,
  Share2,
  Maximize2,
  FileText,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

interface SlideDeckProps {
  carousel: CarouselData;
  onCarouselChange: (carousel: CarouselData) => void;
  onExportPDF: () => void;
  onOpenThread: () => void;
  isExporting: boolean;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({
  carousel,
  onCarouselChange,
  onExportPDF,
  onOpenThread,
  isExporting,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const slides = carousel.slides;
  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const handleUpdateCurrentSlide = (updated: Partial<SlideData>) => {
    const updatedSlides = [...slides];
    updatedSlides[currentIndex] = {
      ...updatedSlides[currentIndex],
      ...updated,
    };
    onCarouselChange({
      ...carousel,
      slides: updatedSlides,
    });
  };

  const handleAddSlide = () => {
    const newSlide: SlideData = {
      slideNumber: slides.length + 1,
      slideType: "content",
      tagline: `INSIGHT #${slides.length}`,
      title: "New Key Takeaway",
      body: "Add your high-converting explanation or data point here.",
      bulletPoints: ["Actionable bullet 1", "Actionable bullet 2"],
      highlight: "Double down on what works.",
    };
    const newSlides = [...slides, newSlide].map((s, idx) => ({
      ...s,
      slideNumber: idx + 1,
    }));
    onCarouselChange({
      ...carousel,
      slides: newSlides,
    });
    setCurrentIndex(newSlides.length - 1);
  };

  const handleDeleteSlide = (indexToDelete: number) => {
    if (slides.length <= 2) {
      alert("A carousel needs at least 2 slides.");
      return;
    }
    const filtered = slides.filter((_, idx) => idx !== indexToDelete);
    const reindexed = filtered.map((s, idx) => ({
      ...s,
      slideNumber: idx + 1,
    }));
    onCarouselChange({
      ...carousel,
      slides: reindexed,
    });
    if (currentIndex >= reindexed.length) {
      setCurrentIndex(reindexed.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Slide {currentIndex + 1} of {slides.length}
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              isEditing
                ? "bg-blue-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            )}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Done Editing" : "Edit Slide Content"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenThread}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-500" />
            <span>X / Twitter Thread</span>
          </button>

          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Generating PDF..." : "Export LinkedIn PDF"}</span>
          </button>
        </div>
      </div>

      {/* Main Preview & Inline Editor Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Slide Canvas Preview */}
        <div className={clsx(isEditing ? "lg:col-span-7" : "lg:col-span-12", "flex flex-col items-center")}>
          <div className="relative w-full max-w-[500px]">
            {/* Slide */}
            <SlidePreview
              slide={currentSlide}
              theme={carousel.theme}
              aspectRatio={carousel.aspectRatio}
              authorName={carousel.authorName}
              authorHandle={carousel.authorHandle}
              showWatermark={carousel.showWatermark}
              totalSlides={slides.length}
            />

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-transform active:scale-90 z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-transform active:scale-90 z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inline Editor Drawer (if opened) */}
        {isEditing && (
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                Edit Slide #{currentIndex + 1}
              </h3>
              <button
                onClick={() => handleDeleteSlide(currentIndex)}
                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 text-xs flex items-center gap-1 font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Slide
              </button>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Badge / Tagline
              </label>
              <input
                type="text"
                value={currentSlide.tagline || ""}
                onChange={(e) => handleUpdateCurrentSlide({ tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. STEP 1 • THE BREAKDOWN"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline / Title
              </label>
              <textarea
                rows={2}
                value={currentSlide.title}
                onChange={(e) => handleUpdateCurrentSlide({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                placeholder="Main takeaway headline"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Body Explanation
              </label>
              <textarea
                rows={3}
                value={currentSlide.body}
                onChange={(e) => handleUpdateCurrentSlide({ body: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="2-3 punchy sentences explaining the principle"
              />
            </div>

            {/* Bullets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bullet Points (one per line)
              </label>
              <textarea
                rows={3}
                value={currentSlide.bulletPoints?.join("\n") || ""}
                onChange={(e) =>
                  handleUpdateCurrentSlide({
                    bulletPoints: e.target.value
                      .split("\n")
                      .filter((b) => b.trim().length > 0),
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="Bullet 1&#10;Bullet 2"
              />
            </div>

            {/* Highlight Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Accent Highlight Quote
              </label>
              <input
                type="text"
                value={currentSlide.highlight || ""}
                onChange={(e) => handleUpdateCurrentSlide({ highlight: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 italic"
                placeholder="e.g. Focus on velocity over theory"
              />
            </div>
          </div>
        )}
      </div>

      {/* Slide Thumbnail Navigation Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            All Slides ({slides.length})
          </span>
          <button
            onClick={handleAddSlide}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Slide
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {slides.map((s, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={clsx(
                  "relative flex flex-col items-center p-2 rounded-xl border-2 transition-all shrink-0 w-24 text-left group",
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 shadow-md"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50"
                )}
              >
                <div className="w-full aspect-[4/5] bg-white rounded-md border border-slate-200 flex flex-col justify-between p-1.5 text-[8px] overflow-hidden">
                  <span className="font-bold text-[7px] text-blue-600">
                    #{s.slideNumber}
                  </span>
                  <p className="line-clamp-2 font-semibold text-[7px] text-slate-800 leading-tight">
                    {s.title}
                  </p>
                  <span className="text-[6px] text-slate-400 truncate">
                    {s.slideType}
                  </span>
                </div>
                <span
                  className={clsx(
                    "text-[10px] font-bold mt-1.5",
                    isSelected ? "text-blue-600" : "text-slate-500"
                  )}
                >
                  Slide {s.slideNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
