import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@/assets": fileURLToPath(new URL("./apps/web/assets", import.meta.url)),
      "@": fileURLToPath(new URL("./apps/web/src", import.meta.url)),
      react: fileURLToPath(new URL("./node_modules/react", import.meta.url)),
      "react-dom": fileURLToPath(
        new URL("./node_modules/react-dom", import.meta.url),
      ),
      "react/jsx-runtime": fileURLToPath(
        new URL("./node_modules/react/jsx-runtime.js", import.meta.url),
      ),
      "react/jsx-dev-runtime": fileURLToPath(
        new URL("./node_modules/react/jsx-dev-runtime.js", import.meta.url),
      ),
      "react-dom/client": fileURLToPath(
        new URL("./node_modules/react-dom/client.js", import.meta.url),
      ),
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
