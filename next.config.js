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
    const path = require('path');
    const buildId = 'my-build-id'; // You can generate a unique ID here if needed
    const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
    
    // Ensure the .next directory exists
    await fs.promises.mkdir(path.dirname(buildIdPath), { recursive: true });
    
    // Write the BUILD_ID file
    await fs.promises.writeFile(buildIdPath, buildId);
    
    return buildId;
  },
}

module.exports = nextConfig
