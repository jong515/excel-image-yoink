/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Disable trace file to avoid Windows EPERM errors
    disableOptimizedLoading: false,
  },
};

export default nextConfig;
