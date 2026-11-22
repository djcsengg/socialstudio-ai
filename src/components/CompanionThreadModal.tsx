"use client";

import React, { useState } from "react";
import { X, Copy, Check, Twitter, Sparkles } from "lucide-react";

interface CompanionThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  threadText?: string;
  topic: string;
}

export const CompanionThreadModal: React.FC<CompanionThreadModalProps> = ({
  isOpen,
  onClose,
  threadText,
  topic,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const content = threadText || "No thread available.";
  const tweets = content.split("\n\n---\n\n");

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <span className="font-black text-sm">𝕏</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Companion X / Twitter Thread
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-sm">
                Formatted for {topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Thread!" : "Copy Full Thread"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tweet List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {tweets.map((tweet, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all space-y-2 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Tweet {idx + 1} of {tweets.length}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(tweet);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[11px] text-slate-500 hover:text-slate-900 transition-opacity flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy Tweet
                </button>
              </div>
              <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {tweet}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
