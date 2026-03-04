/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'switchcode.tech'],
  },
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
