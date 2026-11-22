"use client";

import React, { useState } from "react";
import { Check, Crown, Sparkles, ShieldCheck, Zap } from "lucide-react";
import clsx from "clsx";

interface PricingSectionProps {
  currentTier: "FREE" | "PRO" | "FOUNDER_LTD";
  onSelectTier: (tier: "FOUNDER_LTD" | "PRO", email: string) => void;
  isLoadingTier?: string | null;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  currentTier,
  onSelectTier,
  isLoadingTier,
}) => {
  const [email, setEmail] = useState("");

  const handleCheckout = (tier: "FOUNDER_LTD" | "PRO") => {
    if (!email || !email.includes("@")) {
      const userEmail = prompt("Enter your email address for receipt and account tier access:", "founder@example.com");
      if (!userEmail || !userEmail.includes("@")) {
        alert("A valid email is required to activate your tier.");
        return;
      }
      setEmail(userEmail);
      onSelectTier(tier, userEmail);
    } else {
      onSelectTier(tier, email);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-blue-600" />
            Simple Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Turn Your Ideas Into <span className="text-blue-600">7-Figure</span> Carousels
          </h2>
          <p className="text-base text-slate-600">
            Stop spending 4 hours designing slides in Canva. Generate high-converting LinkedIn slide decks in 30 seconds.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Founder Lifetime Deal (Featured) */}
          <div className="relative bg-white rounded-3xl border-2 border-blue-600 shadow-xl p-8 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-5 right-5">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                🔥 Early-Bird LTD (50 Spots)
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-xl font-black text-slate-900">
                    Founder Lifetime Deal
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Pay once, own forever. The ultimate unfair advantage for serious creators and founders.
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-950">$49</span>
                <span className="text-xs text-slate-400 font-medium">/ lifetime access</span>
                <span className="ml-2 text-xs font-bold text-emerald-600 line-through text-slate-400">
                  $240/yr
                </span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-3 text-xs text-slate-700 font-medium">
                {[
                  "Lifetime access to SocialStudio AI Studio",
                  "Zero watermark on all PDF exports",
                  "Unlimited carousel generation & downloads",
                  "All 4 visual theme presets unlocked",
                  "High-resolution vector PDF export (1080x1350)",
                  "Companion X/Twitter thread generator",
                  "Custom branding (Avatar, Name, Handle)",
                  "Priority Gemini AI prompt intelligence",
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleCheckout("FOUNDER_LTD")}
                disabled={isLoadingTier === "FOUNDER_LTD" || currentTier === "FOUNDER_LTD"}
                className={clsx(
                  "w-full py-3.5 px-4 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2",
                  currentTier === "FOUNDER_LTD"
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 active:scale-95"
                )}
              >
                {isLoadingTier === "FOUNDER_LTD" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : currentTier === "FOUNDER_LTD" ? (
                  <>
                    <Crown className="w-4 h-4 fill-white" />
                    <span>Current Active Plan</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>Get Founder LTD ($49 One-Time)</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 14-day money-back guarantee
              </p>
            </div>
          </div>

          {/* Card 2: Pro Monthly Subscription */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    SocialStudio Pro
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Flexible monthly membership for active growth teams and agencies.
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-950">$19</span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-3 text-xs text-slate-700 font-medium">
                {[
                  "Watermark-free PDF downloads",
                  "Unlimited carousel generation",
                  "All visual themes & aspect ratios",
                  "Companion Twitter/X threads",
                  "Custom author branding",
                  "Cancel anytime with 1 click",
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleCheckout("PRO")}
                disabled={isLoadingTier === "PRO" || currentTier === "PRO" || currentTier === "FOUNDER_LTD"}
                className={clsx(
                  "w-full py-3.5 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
                  currentTier === "PRO"
                    ? "bg-emerald-600 text-white border-transparent cursor-default"
                    : "border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 active:scale-95"
                )}
              >
                {isLoadingTier === "PRO" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : currentTier === "PRO" ? (
                  <span>Current Active Plan</span>
                ) : (
                  <span>Subscribe for $19/mo</span>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Cancel or upgrade anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
