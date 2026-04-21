import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "prefs2025.test",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Produção (quando o site for ao ar)
        protocol: "https",
        hostname: "caxias.ma.gov.br",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
