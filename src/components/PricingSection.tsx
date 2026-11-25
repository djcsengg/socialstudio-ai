"use client";

import React, { useState } from "react";
import { Check, Crown, Sparkles, ShieldCheck, Zap, KeyRound } from "lucide-react";
import clsx from "clsx";
import { TierKey, PRICING_TIERS } from "@/lib/stripe";
import { TierType } from "@/lib/types";

interface PricingSectionProps {
  currentTier: TierType;
  onSelectTier: (tier: TierKey, email: string) => void;
  isLoadingTier?: string | null;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  currentTier,
  onSelectTier,
  isLoadingTier,
}) => {
  const [email, setEmail] = useState("");

  const handleCheckout = (tier: TierKey) => {
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {/* Card 1: Starter Pack */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-5">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                  ⚡ 35 Credits Pack
                </span>
                <div className="flex items-center gap-2 mt-3 mb-1">
                  <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Creator Starter</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Instant launchpack for creators. Zero recurring commitment.
                </p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-950">$9</span>
                <span className="text-xs text-slate-400 font-medium">/ 35 credits</span>
                <span className="ml-auto text-[11px] font-semibold text-emerald-600">
                  ₹499 one-time
                </span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                {PRICING_TIERS.STARTER.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleCheckout("STARTER")}
                disabled={isLoadingTier === "STARTER" || currentTier === "STARTER"}
                className={clsx(
                  "w-full py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                  currentTier === "STARTER"
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-slate-900 hover:bg-slate-800 text-white active:scale-95 shadow-sm"
                )}
              >
                {isLoadingTier === "STARTER" ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : currentTier === "STARTER" ? (
                  <span>Active Pack</span>
                ) : (
                  <span>Get Starter ($9 / ₹499)</span>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Founder Lifetime Deal (Featured) */}
          <div className="relative bg-white rounded-3xl border-2 border-blue-600 shadow-xl p-6 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                🔥 LTD (50 Spots)
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider">
                  👑 Most Popular
                </span>
                <div className="flex items-center gap-2 mt-3 mb-1">
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h3 className="text-lg font-black text-slate-900">Founder LTD</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Pay once, keep forever. 200 generations/year + brand kit.
                </p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-950">$49</span>
                <span className="text-xs text-slate-400 font-medium">/ lifetime</span>
                <span className="ml-auto text-[11px] font-semibold text-emerald-600">
                  ₹1,499
                </span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                {PRICING_TIERS.FOUNDER_LTD.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleCheckout("FOUNDER_LTD")}
                disabled={isLoadingTier === "FOUNDER_LTD" || currentTier === "FOUNDER_LTD"}
                className={clsx(
                  "w-full py-3 px-3 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2",
                  currentTier === "FOUNDER_LTD"
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 active:scale-95"
                )}
              >
                {isLoadingTier === "FOUNDER_LTD" ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : currentTier === "FOUNDER_LTD" ? (
                  <>
                    <Crown className="w-3.5 h-3.5 fill-white" />
                    <span>Current Active Plan</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>Get Founder LTD ($49)</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> 14-day guarantee
              </p>
            </div>
          </div>

          {/* Card 3: BYOK Lifetime */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-5">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                  🛠️ Power Users
                </span>
                <div className="flex items-center gap-2 mt-3 mb-1">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">BYOK License</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Bring Your Own Key. Unlimited generations at zero AI markup.
                </p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-950">$29</span>
                <span className="text-xs text-slate-400 font-medium">/ lifetime</span>
                <span className="ml-auto text-[11px] font-semibold text-emerald-600">
                  ₹999
                </span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                {PRICING_TIERS.BYOK.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleCheckout("BYOK")}
                disabled={isLoadingTier === "BYOK" || currentTier === "BYOK"}
                className={clsx(
                  "w-full py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                  currentTier === "BYOK"
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-sm"
                )}
              >
                {isLoadingTier === "BYOK" ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : currentTier === "BYOK" ? (
                  <span>Active License</span>
                ) : (
                  <span>Get BYOK ($29 / ₹999)</span>
                )}
              </button>
            </div>
          </div>

          {/* Card 4: Pro Monthly Subscription */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-5">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                  🚀 Flexible Agency
                </span>
                <div className="flex items-center gap-2 mt-3 mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">SocialStudio Pro</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Flexible monthly membership for active growth teams.
                </p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-950">$19</span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
                <span className="ml-auto text-[11px] font-semibold text-emerald-600">
                  ₹999/mo
                </span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                {PRICING_TIERS.PRO.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleCheckout("PRO")}
                disabled={isLoadingTier === "PRO" || currentTier === "PRO"}
                className={clsx(
                  "w-full py-3 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2",
                  currentTier === "PRO"
                    ? "bg-emerald-600 text-white border-transparent cursor-default"
                    : "border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 active:scale-95"
                )}
              >
                {isLoadingTier === "PRO" ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : currentTier === "PRO" ? (
                  <span>Current Active Plan</span>
                ) : (
                  <span>Subscribe for $19/mo</span>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                Cancel or upgrade anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
