import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Docker optimizations
  output: 'standalone',
  experimental: {
    // Enable Turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Optimize for containerized environment
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
