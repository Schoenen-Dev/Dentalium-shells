/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongoose"],

  turbopack: {},

  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
