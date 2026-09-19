/**
 * Fares Hub — Editorial Dark Design Tokens
 * Single source of truth for design tokens used across the application.
 * 
 * Philosophy: 70% Dark Neutral / 20% Burgundy / 10% Cream + Gold + Semantic
 */

export const PALETTE = {
  // 70% Dark Neutrals (Dominant surfaces)
  bg: {
    base: "#0D0C0F",     // Deep canvas background
    surface1: "#151318", // Standard cards & containers
    surface2: "#1D1920", // Elevated cards, modals, popovers, dropdowns
    surface3: "#26202A", // Active items, inner wells, hover states
    border: "#2A242E",   // Subtle borders and dividers
    borderLight: "#3D3543", // Emphasized borders
  },

  // 20% Burgundy Brand (Intentional accents & focal points)
  burgundy: {
    deep: "#4A1024",     // Selected backgrounds, dark badges
    primary: "#7A1735",  // Primary buttons, key highlights, active icons
    light: "#A83252",    // Hover borders, interactive glow, text links
    glow: "rgba(122, 23, 53, 0.25)", // Subtle ambient glow
    glowStrong: "rgba(168, 50, 82, 0.4)",
  },

  // 10% Foreground & Accents
  text: {
    cream: "#F1E9DD",    // Primary readable text (warm cream, not stark white)
    muted: "#A7A0A6",    // Secondary & helper text
    dim: "#6B646B",      // Placeholders, disabled states, subtle metadata
  },

  accent: {
    gold: "#C9A15A",       // Milestones, badges, streak counters, PR stars
    goldDim: "rgba(201, 161, 90, 0.15)",
    destructive: "#E05252", // Critical actions, deletions, errors
    destructiveDim: "rgba(224, 82, 82, 0.15)",
    success: "#34D399",     // Completed sets, met daily targets
    successDim: "rgba(52, 211, 153, 0.15)",
    warning: "#F59E0B",
    info: "#60A5FA",
  },
} as const;

export const LAYOUT = {
  // Mobile-first gym tap targets
  minTapTarget: "44px",
  gymInputHeight: "48px",
  navHeight: "64px",
  sidebarWidth: "260px",
  sidebarCollapsedWidth: "76px",
  maxContentWidth: "1280px",
  cardRadius: "16px",
  buttonRadius: "12px",
  badgeRadius: "8px",
} as const;

export const FONTS = {
  arabic: "var(--font-arabic), var(--font-cairo), system-ui, -apple-system, sans-serif",
  latin: "var(--font-latin), system-ui, -apple-system, sans-serif",
} as const;

export const SHADOWS = {
  card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
  cardElevated: "0 8px 32px -4px rgba(0, 0, 0, 0.6)",
  burgundyGlow: "0 4px 24px -2px rgba(122, 23, 53, 0.25)",
  burgundyButton: "0 4px 14px rgba(122, 23, 53, 0.35)",
  goldGlow: "0 0 16px rgba(201, 161, 90, 0.3)",
} as const;

export const GRADIENTS = {
  burgundyButton: "linear-gradient(135deg, #7A1735 0%, #520F24 100%)",
  burgundyButtonHover: "linear-gradient(135deg, #8E1C3F 0%, #63142C 100%)",
  cardSubtle: "linear-gradient(180deg, rgba(29, 25, 32, 0.6) 0%, rgba(21, 19, 24, 0.9) 100%)",
  heroGlow: "radial-gradient(ellipse at top, rgba(122, 23, 53, 0.18) 0%, transparent 70%)",
} as const;

