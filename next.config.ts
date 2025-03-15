import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'via.placeholder.com'],
  },
};

export default nextConfig;
