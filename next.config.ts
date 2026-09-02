import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = "Lodge-Tech-Website";

const nextConfig: NextConfig = {
  assetPrefix: isGithubActions ? `/${repositoryName}` : undefined,
  basePath: isGithubActions ? `/${repositoryName}` : undefined,
  images: {
    unoptimized: true,
    qualities: [75, 95],
  },
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
