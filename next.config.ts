import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },

};
module.exports = {
  allowedDevOrigins: ['192.168.0.122'],
}

export default nextConfig;
