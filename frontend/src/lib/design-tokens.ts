export const designTokens = {
  colors: {
    canvas: "34 42% 97%",
    surface: "0 0% 100%",
    surfaceSubtle: "32 38% 95%",
    foreground: "16 24% 15%",
    muted: "20 10% 40%",
    line: "28 20% 88%",
    accent: "18 86% 54%",
    accentSoft: "36 100% 94%",
    accentYellow: "44 100% 63%",
    accentOrange: "24 92% 57%",
    accentRed: "4 78% 58%",
    success: "161 47% 35%",
    warning: "39 87% 45%",
    danger: "0 63% 52%",
    shadow: "18 22% 18%"
  },
  spacing: {
    section: "2rem",
    card: "1.5rem",
    panel: "1.25rem"
  },
  typography: {
    display: "text-3xl font-semibold tracking-[-0.04em]",
    heading: "text-xl font-semibold tracking-[-0.03em]",
    subheading: "text-base font-medium tracking-[-0.02em]",
    body: "text-sm leading-6 text-muted",
    dense: "text-[13px] leading-5 text-muted"
  }
} as const;
