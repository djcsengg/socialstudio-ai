"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StudioControls } from "@/components/StudioControls";
import { SlideDeck } from "@/components/SlideDeck";
import { PricingSection } from "@/components/PricingSection";
import { CompanionThreadModal } from "@/components/CompanionThreadModal";
import {
  CarouselData,
  GenerateCarouselRequest,
  TierType,
} from "@/lib/types";
import { TierKey } from "@/lib/stripe";
import { generateDeterministicCarousel } from "@/lib/ai";
import { FRAMEWORKS } from "@/lib/themes";
import {
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Download,
  Share2,
  TrendingUp,
  Layers,
  FileCheck,
} from "lucide-react";

const INITIAL_CAROUSEL: CarouselData = generateDeterministicCarousel({
  topic: "How to Build a $100k/year Solopreneur Studio with AI",
  framework: "story",
  aspectRatio: "4:5",
  theme: "modern_minimal",
  authorName: "Alex Mercer",
  authorHandle: "@alexmercer",
});

export default function HomePage() {
  const [carousel, setCarousel] = useState<CarouselData>(INITIAL_CAROUSEL);
  const [currentTier, setCurrentTier] = useState<TierType>("FREE");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [checkoutLoadingTier, setCheckoutLoadingTier] = useState<string | null>(null);

  // Sync tier from localStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTier = localStorage.getItem("socialstudio_tier") as
        | "FREE"
        | "PRO"
        | "FOUNDER_LTD"
        | null;
      if (savedTier && (savedTier === "FOUNDER_LTD" || savedTier === "PRO")) {
        setCurrentTier(savedTier);
        setCarousel((prev) => ({
          ...prev,
          showWatermark: false,
        }));
      }
    }
  }, []);

  const handleGenerate = async (req: GenerateCarouselRequest) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...req,
          showWatermark: currentTier === "FREE",
        }),
      });

      const data = await res.json();
      if (data.success && data.carousel) {
        setCarousel({
          ...data.carousel,
          showWatermark: currentTier === "FREE",
        });
      } else {
        // Fallback locally
        const fallback = generateDeterministicCarousel(req);
        setCarousel({
          ...fallback,
          showWatermark: currentTier === "FREE",
        });
      }
    } catch (err) {
      console.error("Generation error, falling back locally:", err);
      const fallback = generateDeterministicCarousel(req);
      setCarousel({
        ...fallback,
        showWatermark: currentTier === "FREE",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Instant client-side vector PDF generation via jsPDF
      const { generateCarouselPDF } = await import("@/lib/pdf");
      const pdfBytes = generateCarouselPDF(carousel);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${carousel.title.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (clientErr) {
      console.warn("Client-side PDF generation failed, falling back to server route:", clientErr);
      try {
        const res = await fetch("/api/export-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carousel }),
        });

        if (!res.ok) {
          throw new Error("Failed to export PDF");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${carousel.title.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        console.error("PDF download error:", err);
        alert("Failed to generate PDF. Please try again.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectTier = async (tier: TierKey, email: string) => {
    setCheckoutLoadingTier(tier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, email }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Could not initialize checkout.");
      }
    } catch (err) {
      console.error("Checkout redirect error:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoadingTier(null);
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Quick prompt chips
  const promptSuggestions = [
    "5 High-Leverage Habits of Top 1% Solopreneurs",
    "How to Scale from $0 to $10k MRR Without Paid Ads",
    "Why 90% of Tech Startups Fail at Customer Acquisition",
    "The 1-Person AI Software Agency Playbook",
  ];

  return (
    <>
      <Navbar currentTier={currentTier} onUpgradeClick={scrollToPricing} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-bold text-blue-800 shadow-sm animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-blue-600" />
              <span>Day 1 Launch: LinkedIn Carousel & Visual Hook Studio</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.08]">
              Create High-Converting <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                LinkedIn Carousels
              </span>{" "}
              in 30 Seconds
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Stop spending 4+ hours wrestling in Figma or Canva. Transform your raw notes, blogs, or ideas into viral, multi-page slide decks and companion Twitter threads with Google Gemini.
            </p>

            {/* Quick Inspiration Chips */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              <span className="text-xs font-semibold text-slate-400 mr-1">
                Try a prompt:
              </span>
              {promptSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleGenerate({
                      topic: sug,
                      framework: "story",
                      aspectRatio: carousel.aspectRatio,
                      theme: carousel.theme,
                      authorName: carousel.authorName,
                      authorHandle: carousel.authorHandle,
                    });
                  }}
                  className="px-3 py-1 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-full text-xs text-slate-700 font-medium transition-all shadow-sm active:scale-95"
                >
                  ⚡ {sug}
                </button>
              ))}
            </div>

            {/* Metrics Trust Strip */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1080×1350 High-Res PDF Export
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 4 Battle-Tested Theme Presets
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Companion X/Twitter Threads
              </span>
            </div>
          </div>
        </section>

        {/* Studio Workspace Section */}
        <section id="studio" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls Column (5 cols) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <StudioControls
                carousel={carousel}
                onCarouselChange={setCarousel}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                currentTier={currentTier}
                onUpgradeClick={scrollToPricing}
              />
            </div>

            {/* Right Interactive Slide Deck Preview Column (7 cols) */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <SlideDeck
                carousel={carousel}
                onCarouselChange={setCarousel}
                onExportPDF={handleExportPDF}
                onOpenThread={() => setIsThreadOpen(true)}
                isExporting={isExporting}
              />
            </div>
          </div>
        </section>

        {/* Framework Breakdown Section */}
        <section id="frameworks" className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                Proven Conversion Architecture
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
                Built on 5 Viral LinkedIn Frameworks
              </h2>
              <p className="text-sm text-slate-500">
                Each carousel is generated using structured psychological frameworks designed to maximize save rates, comments, and direct inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {FRAMEWORKS.map((fw) => (
                <div
                  key={fw.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {fw.badge}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {fw.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {fw.description}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleGenerate({
                        topic: carousel.topic,
                        framework: fw.id as any,
                        aspectRatio: carousel.aspectRatio,
                        theme: carousel.theme,
                        authorName: carousel.authorName,
                        authorHandle: carousel.authorHandle,
                      });
                      const el = document.getElementById("studio");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors pt-2"
                  >
                    <span>Use Framework</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection
          currentTier={currentTier}
          onSelectTier={handleSelectTier}
          isLoadingTier={checkoutLoadingTier}
        />
      </main>

      <Footer />

      {/* Companion Thread Modal */}
      <CompanionThreadModal
        isOpen={isThreadOpen}
        onClose={() => setIsThreadOpen(false)}
        threadText={carousel.twitterThread}
        topic={carousel.topic}
      />
    </>
  );
}
