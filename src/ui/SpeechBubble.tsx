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
          ? "bg-[#F2EADF] text-[#18151B] border border-[#D6AA63]/40"
          : "bg-[#211C23] text-[#F2EADF] border border-[#7C1D38]/50"
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[#D6AA63] text-lg select-none leading-none">❝</span>
        <div className="flex-1 leading-snug">{children}</div>
        <span className="text-[#7C1D38] text-lg select-none leading-none">❞</span>
      </div>

      {/* Comic Speech Bubble Tail */}
      {tailDirection === "right" && (
        <div
          className={`absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-l-8 ${
            isCream ? "border-l-[#F2EADF]" : "border-l-[#211C23]"
          }`}
        />
      )}
      {tailDirection === "left" && (
        <div
          className={`absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-8 ${
            isCream ? "border-r-[#F2EADF]" : "border-r-[#211C23]"
          }`}
        />
      )}
      {tailDirection === "bottom" && (
        <div
          className={`absolute -bottom-2 right-6 w-0 h-0 border-x-6 border-x-transparent border-t-8 ${
            isCream ? "border-t-[#F2EADF]" : "border-t-[#211C23]"
          }`}
        />
      )}
    </div>
  );
};
