/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for App Router
  experimental: {
    appDir: true,  // Enabling appDir for SSR
  },
  
  // Enable React strict mode
  reactStrictMode: true,  // Enable react strict mode
  
  // Disable disk caching—use in‐memory cache only
  webpack: (config, { dev }) => {
    config.cache = {
      type: 'memory',
    };
    return config;
  },
  
  async rewrites() {
    return [
      {
        source: '/api/login',
        destination: 'https://teddyetsbackend.azurewebsites.net/login',
      },
      {
        source: '/role-overview',
        destination: '/role-overview',
      },
    ];
  },
  
  // Ensure proper routing for SPA behavior
  trailingSlash: false,
  
  // Optimize images for deployment
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;