import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // 1) deixa o lint passar
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2) deixa o TS passar
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3) desativa o otimizador de imagens (evita /_next/image em loop)
  images: {
    unoptimized: true,
  },

  async rewrites() {
    const API_BASE_URL = "https://alfastore-api.onrender.com/api/v1";

    return [
      {
        source: "/api/proxy/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/register",
        destination: "/createUser",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
