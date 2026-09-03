import { defineConfig, devices } from "@playwright/test";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const port = 3000;

process.env.SESSION_SECRET ??= "playwright-demo-admin-session-secret-000000";

export default defineConfig({
  testDir: "./apps/web/test/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  timeout: 45_000,
  workers: process.env.CI ? 2 : 4,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { height: 900, width: 1440 },
      },
    },
    {
      name: "tablet-chromium",
      use: {
        ...devices["Desktop Chrome"],
        hasTouch: true,
        viewport: { height: 1024, width: 768 },
      },
    },
    {
      name: "compact-desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { height: 768, width: 1024 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Desktop Chrome"],
        hasTouch: true,
        isMobile: true,
        viewport: { height: 844, width: 390 },
      },
    },
    {
      name: "narrow-mobile-chromium",
      use: {
        ...devices["Desktop Chrome"],
        hasTouch: true,
        isMobile: true,
        viewport: { height: 800, width: 360 },
      },
    },
  ],
  webServer: {
    command: `pnpm --filter @lodging-technologies/web dev --hostname 127.0.0.1 --port ${port}`,
    reuseExistingServer: !process.env.CI,
    url: `http://127.0.0.1:${port}`,
  },
});
