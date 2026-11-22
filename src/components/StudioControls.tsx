"use client";

import React, { useState } from "react";
import {
  CarouselData,
  FrameworkType,
  ThemeId,
  AspectRatio,
  GenerateCarouselRequest,
} from "@/lib/types";
import { THEMES, FRAMEWORKS } from "@/lib/themes";
import {
  Sparkles,
  Palette,
  Layout,
  User,
  Layers,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Wand2,
} from "lucide-react";
import clsx from "clsx";

interface StudioControlsProps {
  carousel: CarouselData;
  onCarouselChange: (carousel: CarouselData) => void;
  onGenerate: (req: GenerateCarouselRequest) => void;
  isGenerating: boolean;
  currentTier: "FREE" | "PRO" | "FOUNDER_LTD";
  onUpgradeClick: () => void;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  carousel,
  onCarouselChange,
  onGenerate,
  isGenerating,
  currentTier,
  onUpgradeClick,
}) => {
  const [topic, setTopic] = useState(carousel.topic);
  const [rawText, setRawText] = useState("");
  const [showRawText, setShowRawText] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<FrameworkType>(
    carousel.framework
  );
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(carousel.theme);
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>(
    carousel.aspectRatio
  );
  const [authorName, setAuthorName] = useState(carousel.authorName || "Alex Mercer");
  const [authorHandle, setAuthorHandle] = useState(carousel.authorHandle || "@alexmercer");

  const handleTriggerGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onGenerate({
      topic,
      rawText: rawText.trim() || undefined,
      framework: selectedFramework,
      aspectRatio: selectedAspect,
      theme: selectedTheme,
      authorName,
      authorHandle,
    });
  };

  const handleThemeChange = (newTheme: ThemeId) => {
    setSelectedTheme(newTheme);
    onCarouselChange({
      ...carousel,
      theme: newTheme,
    });
  };

  const handleAspectChange = (newAspect: AspectRatio) => {
    setSelectedAspect(newAspect);
    onCarouselChange({
      ...carousel,
      aspectRatio: newAspect,
    });
  };

  const handleAuthorUpdate = (name: string, handle: string) => {
    setAuthorName(name);
    setAuthorHandle(handle);
    onCarouselChange({
      ...carousel,
      authorName: name,
      authorHandle: handle,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* AI Prompt Ingestion */}
      <form onSubmit={handleTriggerGenerate} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Carousel Topic or Core Thesis
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Gemini 1.5 Pipeline
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 Lessons from Scaling to $10k/month as a Solo Developer"
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
              required
            />
          </div>
        </div>

        {/* Accordion for Raw Text / Blog Post / Notes */}
        <div>
          <button
            type="button"
            onClick={() => setShowRawText(!showRawText)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            {showRawText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showRawText ? "Hide source context" : "+ Paste article, notes, or transcript to convert"}</span>
          </button>

          {showRawText && (
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw thoughts, a newsletter issue, or podcast transcript to transform into a high-converting carousel..."
              className="mt-2 w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Architecting Carousel with Gemini AI...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 fill-white" />
              <span>Generate Viral Carousel</span>
            </>
          )}
        </button>
      </form>

      <hr className="border-slate-100" />

      {/* Framework Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-600" />
          Content Framework
        </label>
        <div className="grid grid-cols-1 gap-2">
          {FRAMEWORKS.map((fw) => {
            const isSelected = selectedFramework === fw.id;
            return (
              <button
                key={fw.id}
                type="button"
                onClick={() => {
                  setSelectedFramework(fw.id as FrameworkType);
                  onCarouselChange({
                    ...carousel,
                    framework: fw.id as FrameworkType,
                  });
                }}
                className={clsx(
                  "p-2.5 rounded-xl border text-left transition-all flex items-center justify-between",
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{fw.name}</p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {fw.description}
                  </p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap ml-2">
                  {fw.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Theme Presets */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-purple-600" />
          Theme Preset
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {Object.values(THEMES).map((th) => {
            const isSelected = selectedTheme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => handleThemeChange(th.id)}
                className={clsx(
                  "p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24",
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                    : "border-slate-200 hover:border-slate-300",
                  th.previewBg
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">{th.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
                  )}
                </div>
                <p className="text-[10px] opacity-80 line-clamp-2 leading-tight">
                  {th.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Aspect Ratio Switcher */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-cyan-600" />
          Aspect Ratio
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleAspectChange("4:5")}
            className={clsx(
              "p-3 rounded-xl border text-center transition-all",
              selectedAspect === "4:5"
                ? "border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm"
                : "border-slate-200 hover:border-slate-300 text-slate-700 font-medium"
            )}
          >
            <p className="text-xs">4:5 Vertical Portrait</p>
            <span className="text-[10px] text-slate-500 block">
              1080 × 1350 (LinkedIn Best)
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAspectChange("1:1")}
            className={clsx(
              "p-3 rounded-xl border text-center transition-all",
              selectedAspect === "1:1"
                ? "border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm"
                : "border-slate-200 hover:border-slate-300 text-slate-700 font-medium"
            )}
          >
            <p className="text-xs">1:1 Square</p>
            <span className="text-[10px] text-slate-500 block">
              1080 × 1080 (Multi-Platform)
            </span>
          </button>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Author Branding */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-4 h-4 text-slate-600" />
          Author Branding
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Author Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => handleAuthorUpdate(e.target.value, authorHandle)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Alex Mercer"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Social Handle
            </label>
            <input
              type="text"
              value={authorHandle}
              onChange={(e) => handleAuthorUpdate(authorName, e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@alexmercer"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Watermark & Plan Status */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            {carousel.showWatermark ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600" /> Watermark Active (Free)
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-600" /> Watermark Removed (Pro / LTD)
              </>
            )}
          </span>
          <p className="text-[10px] text-slate-500">
            {carousel.showWatermark
              ? "Free tier exports include subtle '⚡ Created with SocialStudio AI'"
              : "Clean exports with your 100% custom branding"}
          </p>
        </div>

        {carousel.showWatermark && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            Upgrade ($49)
          </button>
        )}
      </div>
    </div>
  );
};
