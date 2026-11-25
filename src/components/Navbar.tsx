"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Crown, Zap, KeyRound } from "lucide-react";
import { TierType } from "@/lib/types";

interface NavbarProps {
  currentTier: TierType;
  onUpgradeClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTier, onUpgradeClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-black text-slate-900 tracking-tight text-lg flex items-center gap-1.5">
                SocialStudio <span className="text-blue-600">AI</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-400 tracking-wide uppercase">
                LinkedIn Carousel Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          <Link href="#studio" className="hover:text-blue-600 transition-colors">
            Studio
          </Link>
          <Link href="#frameworks" className="hover:text-blue-600 transition-colors">
            Frameworks
          </Link>
          <Link href="#pricing" className="hover:text-blue-600 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Actions & Tier Badge */}
        <div className="flex items-center gap-3">
          {currentTier === "FOUNDER_LTD" ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span>Founder Lifetime</span>
            </div>
          ) : currentTier === "PRO" ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pro Member</span>
            </div>
          ) : currentTier === "STARTER" ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-800">
              <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span>Starter Pack</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onUpgradeClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all shadow-blue-500/20 active:scale-95"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Get Founder LTD ($49)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
