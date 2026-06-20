import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import localFont from "next/font/local";

// Display / headings / nav: Cabinet Grotesk (Fontshare, committed woff2)
// Variable font loaded via next/font/local — no external network call at runtime.
export const display = localFont({
  src: "../app/fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-display",
  display: "swap",
});

// Body / labels: Geist (Google Fonts, via next/font/google)
export const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Figures / SKUs / money / counts: Geist Mono (Google Fonts, via next/font/google)
export const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Arabic: IBM Plex Sans Arabic (kept)
export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable} ${arabic.variable}`;
