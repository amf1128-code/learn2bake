import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages deployment.
  // Disabled locally so the /admin interface and API routes work.
  ...(isStaticExport ? { output: "export" } : {}),
  basePath: "/learn2bake",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
