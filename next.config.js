/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable SSR when needed - currently set for SPA mode
  // To enable SSR, remove this or set to false
  output: 'standalone',
  // Suppress deprecation warnings in console
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
