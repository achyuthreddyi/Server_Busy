import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  typescript: {
    // Warning: This allows production builds to complete even if
    // there are type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
