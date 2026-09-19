import React from "react";
import { cn } from "@/lib/utils";

export interface ComicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  accent?: boolean;
  elevated?: boolean;
  sticker?: string;
  className?: string;
}

export const ComicCard: React.FC<ComicCardProps> = ({
  children,
  accent = false,
  elevated = false,
  sticker,
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-4 md:p-5 transition-all duration-200",
        elevated
          ? "hub-card-elevated"
          : accent
          ? "hub-card-accent"
          : "hub-card",
        className
      )}
      {...props}
    >
      {sticker && (
        <div className="absolute -top-3 start-4 hub-badge text-[11px] font-black uppercase tracking-wider shadow-sm select-none border border-[#C9A15A]/40 bg-[#1D1920] text-[#C9A15A] px-2.5 py-0.5 rounded-lg font-latin">
          {sticker}
        </div>
      )}
      {children}
    </div>
  );
};

export const HubCard = ComicCard;
