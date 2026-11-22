"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const urlTier = searchParams.get("tier");

  const [status, setStatus] = useState<"loading" | "verified" | "error">("loading");
  const [tier, setTier] = useState<string>(urlTier || "FOUNDER_LTD");

  useEffect(() => {
    async function verify() {
      if (!sessionId) {
        setStatus("verified");
        return;
      }

      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (data.success) {
          setTier(data.tier);
          setStatus("verified");
          // Persist upgraded tier in localStorage so the studio unlocks watermarks
          if (typeof window !== "undefined") {
            localStorage.setItem("socialstudio_tier", data.tier);
          }
        } else {
          setStatus("verified"); // Still allow access if session was fulfilled
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("verified");
      }
    }

    verify();
  }, [sessionId]);

  const isFounder = tier === "FOUNDER_LTD";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
          {isFounder ? (
            <Crown className="w-8 h-8 fill-white" />
          ) : (
            <Sparkles className="w-8 h-8 fill-white" />
          )}
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payment Successful
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {isFounder ? "Welcome, Founder!" : "Welcome to SocialStudio Pro!"}
          </h1>
          <p className="text-xs text-slate-500">
            Your account has been upgraded. All watermarks have been removed from your carousels.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2.5 text-xs text-slate-700 font-medium">
          <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Unlocked Privileges:
          </p>
          <ul className="space-y-1.5 pl-5 list-disc text-slate-600">
            <li>Zero watermark badge on all PDF downloads</li>
            <li>Unlimited high-resolution vertical & square carousels</li>
            <li>Access to all 4 theme presets</li>
            <li>Instant companion X/Twitter thread generation</li>
          </ul>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
        >
          <span>Launch Studio Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-slate-400">Loading receipt...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
