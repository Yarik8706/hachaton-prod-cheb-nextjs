import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // ...
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // разрешает любые домены по HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // если нужно также HTTP
      },
    ],
    unoptimized: true, // можно отключить оптимизацию, если используется нестандартный источник
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@tanstack/react-query": path.resolve(
        __dirname,
        "src/lib/vendor/react-query.tsx"
      ),
      zustand: path.resolve(__dirname, "src/lib/vendor/zustand.ts"),
      zod: path.resolve(__dirname, "src/lib/vendor/zod.ts"),
      axios: path.resolve(__dirname, "src/lib/vendor/axios.ts"),
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
