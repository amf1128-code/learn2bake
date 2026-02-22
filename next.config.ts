import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/learn2bake",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
