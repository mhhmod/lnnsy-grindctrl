import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Set by the GitHub Pages workflow to the repo subpath (e.g. "/lnnsy-grindctrl").
// Empty locally so `npm run dev` / local builds serve from root.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export", // static HTML export for GitHub Pages
  basePath,
  trailingSlash: true, // emit dir/index.html so Pages can serve nested routes
  images: { unoptimized: true }, // no Image Optimization server on static hosting
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default withNextIntl(nextConfig);
