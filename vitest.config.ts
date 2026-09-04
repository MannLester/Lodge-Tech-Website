import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./apps/web/src", import.meta.url)),
      "@assets": fileURLToPath(new URL("./apps/web/assets", import.meta.url)),
    },
  },
  root: repoRoot,
  test: {
    environment: "jsdom",
    include: ["apps/web/src/**/*.test.{ts,tsx}", "packages/**/*.test.{ts,tsx}"],
    maxWorkers: 1,
    pool: "threads",
    setupFiles: ["./apps/web/test/vitest.setup.ts"],
  },
});
