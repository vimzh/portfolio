import { createMDX } from "fumadocs-mdx/next";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Small Tailwind stylesheet: avoid a render-blocking request on first visits.
  experimental: { inlineCss: true },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
