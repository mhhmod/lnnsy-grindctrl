import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Legacy shadcn HSL tokens — kept for backward compat (Batch C removes) ──
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        muted: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },

        // ── B&W Ledger token layer — all grayscale, no hue ──────────────────
        paper:      "var(--paper)",
        ink:        "var(--ink)",
        muted2:     "var(--muted)",    /* secondary text (avoid name clash with shadcn muted) */
        faint:      "var(--faint)",
        hairline:   "var(--hairline)",
        wash:       "var(--wash)",

        // Warm-named aliases kept for existing className refs — all grayscale
        "muted-warm":  "var(--muted-warm)",
        "faint-warm":  "var(--faint-warm)",
        "ring-warm":   "var(--ring-warm)",

        // Ember neutralised — kept so stray className refs compile; Batch B purges
        ember:       "var(--ember)",
        "ember-weak":"var(--ember-weak)",
        "on-ember":  "var(--on-ember)",
      },
      borderRadius: { lg: "var(--radius)", md: "var(--radius)", sm: "var(--radius)" },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans:    ["var(--font-sans)",    "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)",    "ui-monospace", "monospace"],
        arabic:  ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
