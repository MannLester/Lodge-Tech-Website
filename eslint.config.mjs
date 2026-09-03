import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
    settings: {
      next: {
        rootDir: "apps/web/",
      },
    },
  },
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  globalIgnores([
    ".next/**",
    "apps/web/.next/**",
    ".vercel/**",
    "coverage/**",
    "out/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
