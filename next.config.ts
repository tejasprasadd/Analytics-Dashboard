import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reqres.in",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
