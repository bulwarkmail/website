import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
