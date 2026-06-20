import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── B&W Ledger token layer — all grayscale, no hue ──────────────────
        paper:      "var(--paper)",
        ink:        "var(--ink)",
        muted:      "var(--muted)",    /* secondary text */
        muted2:     "var(--muted)",    /* alias — prefer muted */
        faint:      "var(--faint)",
        hairline:   "var(--hairline)",
        wash:       "var(--wash)",

        // Warm-named aliases kept for existing className refs — all grayscale
        "muted-warm":  "var(--muted-warm)",
        "faint-warm":  "var(--faint-warm)",
        "ring-warm":   "var(--ring-warm)",
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
