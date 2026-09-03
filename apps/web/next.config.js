import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(appDir, "../..");

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 95],
  },
  reactStrictMode: true,
  transpilePackages: [
    "@lodging-technologies/types",
    "@lodging-technologies/ui",
    "@lodging-technologies/zod-schemas",
  ],
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
