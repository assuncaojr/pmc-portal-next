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
        protocol: "https",
        hostname: "imagens.usp.br",
        pathname: "/**",
      },
      {
        // Produção (quando o site for ao ar)
        protocol: "https",
        hostname: "caxias.ma.gov.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
  logging: false,
  // Tip: Adicionar aqui se voltar a ter problemas com a data antiga
  // async redirects() {
  //   return [
  //     {
  //       source: "/:year/:month/:day/:slug",
  //       destination: "/:year/:month/:slug",
  //       permanent: true,
  //     },
  //   ];
  // },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
