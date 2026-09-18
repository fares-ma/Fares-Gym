import React from "react";
import { MiniFares } from "./MiniFares";
import { useRandomQuote } from "@/lib/useRandomQuote";
import { QuoteContext } from "@/i18n/quotes";

interface QuoteBannerProps {
  context?: QuoteContext;
  tag?: string;
  className?: string;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({
  context = "home",
  tag = "CONSISTENCY WINS.",
  className = "",
}) => {
  const quote = useRandomQuote(context);

  return (
    <div
      className={`comic-card p-4 md:p-5 flex items-center justify-between gap-3 md:gap-4 overflow-hidden relative border border-[#2B252E] hover:border-[#7C1D38]/40 ${className}`}
    >
      {/* Mini Fares illustration */}
      <div className="shrink-0 flex items-center">
        <MiniFares
          face="thinking"
          size="md"
          animate="float"
          className="rounded-xl overflow-hidden"
          imageClassName="scale-110"
        />
      </div>

      {/* Quote content */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {tag && (
          <span className="text-[11px] font-black text-[#D6AA63] tracking-wider uppercase mb-1 font-mono">
            {tag}
          </span>
        )}
        <div className="relative bg-[#211C23] border border-[#7C1D38]/40 rounded-xl p-3 text-sm md:text-base font-bold text-[#F2EADF] leading-relaxed shadow-sm">
          <div className="flex items-start gap-1">
            <span className="text-[#7C1D38] text-base select-none leading-none">❝</span>
            <span className="flex-1">{quote}</span>
            <span className="text-[#D6AA63] text-base select-none leading-none">❞</span>
          </div>
          <div className="text-left text-[10px] text-[#9D969D] mt-1 font-mono tracking-wide">
            — FARES
          </div>
        </div>
      </div>
    </div>
  );
};
