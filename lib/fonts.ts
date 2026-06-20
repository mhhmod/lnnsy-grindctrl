import { Space_Grotesk, Inter, JetBrains_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";

// Display / headings / nav: Space Grotesk (500–700)
export const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Body / labels: Inter (400–600)
export const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Figures / SKUs / money / counts: JetBrains Mono (tabular numbers)
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Arabic: IBM Plex Sans Arabic (kept)
export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable} ${arabic.variable}`;
