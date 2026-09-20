import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The deploys (.github/workflows/beta.yml, production.yml) ship a
  // self-contained server. Local `next start` runs from the checkout, so
  // standalone output stays opt-in.
  ...(process.env.NEXT_OUTPUT_STANDALONE === "1" ? { output: "standalone" as const } : {}),
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // The branding guidelines moved out of the docs into /brand.
      { source: "/docs/branding/guidelines", destination: "/brand", permanent: true },
      { source: "/docs/branding", destination: "/brand", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/compose.yml",
        destination:
          "https://raw.githubusercontent.com/bulwarkmail/webmail/main/docker-compose.yml",
      },
    ];
  },
};

export default nextConfig;
