import React from "react";
import Image from "next/image";
import { SpeechBubble } from "./SpeechBubble";

export type CharacterPose =
  | "hero-bench"
  | "hero-standing"
  | "hero-rest-day"
  | "gym-dumbbell"
  | "gym-warmup"
  | "gym-bench-press"
  | "rest-timer-sitting"
  | "food-plate"
  | "study-laptop"
  | "progress-chart"
  | "settings-wrench"
  | "fist-pump"
  | "thumbs-up"
  | "clapping"
  | "trophy"
  | "pointing-right"
  | "waving"
  | "shushing"
  | "walking"
  | "on-my-way"
  | "drinking-water"
  | "notebook"
  | "stretching"
  | "meditation"
  | "celebrating"
  | "cooking"
  | "avatar-circle";

export type CharacterFace =
  | "normal"
  | "happy"
  | "focused"
  | "confused"
  | "laughing"
  | "cool"
  | "thinking"
  | "tired"
  | "angry"
  | "surprised"
  | "sleepy";

interface MiniFaresProps {
  pose?: CharacterPose;
  face?: CharacterFace;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  animate?: "breathe" | "bounce" | "float" | "none";
  speech?: string;
  speechVariant?: "cream" | "dark";
  speechDirection?: "left" | "right" | "top" | "bottom";
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  alt?: string;
}

const SIZE_MAP = {
  xs: { width: 36, height: 36, css: "w-9 h-9" },
  sm: { width: 56, height: 56, css: "w-14 h-14" },
  md: { width: 100, height: 100, css: "w-24 h-24 md:w-28 md:h-28" },
  lg: { width: 160, height: 160, css: "w-36 h-36 md:w-44 md:h-44" },
  xl: { width: 240, height: 240, css: "w-52 h-52 md:w-64 md:h-64" },
  "2xl": { width: 320, height: 320, css: "w-72 h-72 md:w-80 md:h-80" },
};

export const MiniFares: React.FC<MiniFaresProps> = ({
  pose,
  face,
  size = "md",
  animate = "breathe",
  speech,
  speechVariant = "dark",
  speechDirection = "left",
  priority = false,
  className = "",
  imageClassName = "",
  alt = "Mini Fares",
}) => {
  // Determine image source
  let src = "/character/poses/hero-standing.png";
  if (face) {
    src = `/character/faces/${face}.png`;
  } else if (pose) {
    if (pose === "avatar-circle") {
      src = "/character/avatar.png";
    } else {
      src = `/character/poses/${pose}.png`;
    }
  }

  // Determine animation CSS
  let animClass = "";
  if (animate === "breathe") animClass = "animate-breathe";
  else if (animate === "bounce") animClass = "animate-bounce-subtle";
  else if (animate === "float") animClass = "animate-float-gentle";

  const sizeConfig = SIZE_MAP[size];

  const characterNode = (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeConfig.css} ${animClass} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height}
        priority={priority}
        className={`object-contain w-full h-full drop-shadow-md transition-transform duration-200 ${imageClassName}`}
      />
    </div>
  );

  if (!speech) {
    return characterNode;
  }

  // If speech bubble is requested, wrap in layout
  return (
    <div className="inline-flex items-center gap-3">
      {speechDirection === "right" && (
        <SpeechBubble variant={speechVariant} tailDirection="right">
          {speech}
        </SpeechBubble>
      )}
      {characterNode}
      {speechDirection === "left" && (
        <SpeechBubble variant={speechVariant} tailDirection="left">
          {speech}
        </SpeechBubble>
      )}
    </div>
  );
};
