import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-subtle": "hsl(var(--surface-subtle) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-soft": "hsl(var(--accent-soft) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)"
      },
      boxShadow: {
        panel: "0 12px 48px hsl(var(--shadow) / 0.08)",
        soft: "0 2px 16px hsl(var(--shadow) / 0.06)"
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.5rem"
      },
      maxWidth: {
        reading: "76rem",
        prose: "48rem"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
