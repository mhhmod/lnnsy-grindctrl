import { Space_Grotesk, Inter, JetBrains_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";

export const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
export const sans = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
export const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });
export const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-arabic" });

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable} ${arabic.variable}`;
