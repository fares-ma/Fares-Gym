import React from "react";

interface SpeechBubbleProps {
  children: React.ReactNode;
  variant?: "cream" | "dark";
  tailDirection?: "left" | "right" | "bottom" | "top";
  className?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  children,
  variant = "dark",
  tailDirection = "right",
  className = "",
}) => {
  const isCream = variant === "cream";

  return (
    <div
      className={`relative rounded-2xl px-4 py-2.5 text-sm md:text-base font-semibold transition-all duration-300 shadow-md ${
        isCream
          ? "bg-[#F1E9DD] text-[#151318] border border-[#C9A15A]/40"
          : "bg-[#1D1920] text-[#F1E9DD] border border-[#2A242E]"
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[#C9A15A] text-lg select-none leading-none">❝</span>
        <div className="flex-1 leading-snug">{children}</div>
        <span className="text-[#A83252] text-lg select-none leading-none">❞</span>
      </div>

      {/* Comic Speech Bubble Tail */}
      {tailDirection === "right" && (
        <div
          className={`absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-l-8 ${
            isCream ? "border-l-[#F1E9DD]" : "border-l-[#1D1920]"
          }`}
        />
      )}
      {tailDirection === "left" && (
        <div
          className={`absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-8 ${
            isCream ? "border-r-[#F1E9DD]" : "border-r-[#1D1920]"
          }`}
        />
      )}
      {tailDirection === "bottom" && (
        <div
          className={`absolute -bottom-2 right-6 w-0 h-0 border-x-6 border-x-transparent border-t-8 ${
            isCream ? "border-t-[#F1E9DD]" : "border-t-[#1D1920]"
          }`}
        />
      )}
    </div>
  );
};
