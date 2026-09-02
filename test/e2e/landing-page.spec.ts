import { expect, test } from "@playwright/test";

test("renders the complete landing page without document overflow", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Energy wasted is money lost. We make buildings use less.",
    }),
  ).toBeVisible();
  await expect(page.locator("#industries")).toBeVisible();
  await expect(page.locator("#results")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();

  const hasDocumentOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasDocumentOverflow).toBe(false);
});

test("provides navigation appropriate to the viewport", async ({ page }) => {
  await page.goto("/");

  const viewport = page.viewportSize();
  if (!viewport) throw new Error("Viewport is required for this test.");

  if (viewport.width < 1024) {
    const menuButton = page.getByRole("button", { name: "Open navigation" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
  } else {
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
  }
});

test("persists the selected color theme", async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.localStorage.getItem("theme")) {
      window.localStorage.setItem("theme", "light");
    }
  });
  await page.goto("/");

  await page.getByRole("button", { name: "Switch to night mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
