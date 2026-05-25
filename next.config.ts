import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Прямая отдача из /public — без /_next/image (избегаем 400 в Docker)
    unoptimized: true,
  },
};

export default nextConfig;
