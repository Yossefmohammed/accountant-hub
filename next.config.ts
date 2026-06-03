import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config: any, { dev }: { dev: boolean }) => {
    if (dev) config.cache = false;
    return config;
  },
};

export default nextConfig;
