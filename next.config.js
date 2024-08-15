/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: '',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Generate the BUILD_ID file
  generateBuildId: async () => {
    const fs = require('fs');
    const buildId = 'my-build-id'; // You can generate a unique ID here if needed
    fs.writeFileSync('.next/BUILD_ID', buildId);
    return buildId;
  },
}

module.exports = nextConfig
