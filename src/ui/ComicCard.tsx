import React from "react";

interface ComicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  accent?: boolean;
  sticker?: string;
  className?: string;
}

export const ComicCard: React.FC<ComicCardProps> = ({
  children,
  accent = false,
  sticker,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`relative rounded-2xl p-4 md:p-5 transition-all duration-200 ${
        accent ? "comic-card-accent" : "comic-card"
      } ${className}`}
      {...props}
    >
      {sticker && (
        <div className="absolute -top-3 left-4 comic-badge text-xs uppercase tracking-wider shadow-sm select-none">
          {sticker}
        </div>
      )}
      {children}
    </div>
  );
};
