import React from "react";
import Link from "next/link";
import { Zap, Heart, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">SocialStudio AI</p>
              <p className="text-xs text-slate-500">AI LinkedIn Carousel & Visual Hook Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="#pricing" className="hover:text-slate-900">
              Founder Deal ($49 LTD)
            </Link>
            <Link href="#frameworks" className="hover:text-slate-900">
              Carousel Frameworks
            </Link>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Stripe Secure Checkout
            </span>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} ATS SocialStudio AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
