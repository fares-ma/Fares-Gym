import React from "react";
import { MiniFares, CharacterFace, CharacterPose } from "./MiniFares";
import { useRandomQuote } from "@/lib/useRandomQuote";
import { QuoteContext } from "@/i18n/quotes";

interface QuoteBannerProps {
  context?: QuoteContext;
  tag?: string;
  face?: CharacterFace;
  pose?: CharacterPose;
  className?: string;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({
  context = "home",
  tag = "CONSISTENCY WINS.",
  face = "thinking",
  pose,
  className = "",
}) => {
  const quote = useRandomQuote(context);

  return (
    <div
      className={`hub-card p-4 md:p-5 flex items-center justify-between gap-3 md:gap-4 overflow-hidden relative border border-[#2A242E] hover:border-[#7A1735]/40 transition-colors ${className}`}
    >
      {/* Mini Fares illustration */}
      <div className="shrink-0 flex items-center">
        <MiniFares
          face={face}
          pose={pose}
          size="md"
          animate="float"
          className="rounded-xl overflow-hidden"
          imageClassName="scale-110"
        />
      </div>

      {/* Quote content */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {tag && (
          <span className="text-[11px] font-black text-[#C9A15A] tracking-wider uppercase mb-1.5 font-latin">
            {tag}
          </span>
        )}
        <div className="relative bg-[#1D1920] border border-[#2A242E] rounded-xl p-3 md:p-3.5 text-sm md:text-base font-bold text-[#F1E9DD] leading-relaxed shadow-sm">
          <div className="flex items-start gap-1.5">
            <span className="text-[#A83252] text-base select-none leading-none">❝</span>
            <span className="flex-1">{quote}</span>
            <span className="text-[#C9A15A] text-base select-none leading-none">❞</span>
          </div>
          <div className="text-left text-[10px] text-[#A7A0A6] mt-1.5 font-latin tracking-wider uppercase font-semibold">
            — FARES
          </div>
        </div>
      </div>
    </div>
  );
};

