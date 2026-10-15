/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["falkordb"],
  transpilePackages: [
    "@sengra/graph",
    "@sengra/schema",
    "@sengra/tools",
    "@sengra/policy",
    "@sengra/memory",
    "@sengra/analysis",
    "@sengra/data",
    "@sengra/agent",
    "@sengra/ui",
    "@sengra/eval",
    "@sengra/config",
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
