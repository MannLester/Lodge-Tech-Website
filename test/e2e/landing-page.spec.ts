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

test("presents the closing conversion section from the design reference", async ({
  page,
}) => {
  await page.goto("/");

  const contactSection = page.locator("#contact");
  await expect(
    contactSection.getByRole("heading", {
      name: "Your building is already consuming energy. Let's make it consume less.",
    }),
  ).toBeVisible();

  await expect(
    contactSection.getByRole("link", { name: "Get a Savings Analysis" }),
  ).toBeVisible();
  await expect(
    contactSection.getByRole("link", { name: "Request a Demo" }),
  ).toBeVisible();
  await expect(
    contactSection.getByRole("link", { name: "Talk to an Expert" }),
  ).toBeVisible();
  const experienceBadge = contactSection.getByLabel(
    "40 plus years of energy intelligence",
  );
  await expect(experienceBadge).toContainText("40+");
  await expect(experienceBadge).toContainText("of Energy Intelligence");

  const sectionStyles = await contactSection.evaluate((section) => {
    const styles = window.getComputedStyle(section);
    return {
      backgroundColor: styles.backgroundColor,
      height: section.getBoundingClientRect().height,
    };
  });
  const primaryCta = contactSection.getByRole("link", {
    name: "Get a Savings Analysis",
  });
  const primaryCtaLineHeight = await primaryCta.evaluate((link) => {
    const styles = window.getComputedStyle(link);
    return {
      height: link.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(styles.lineHeight),
    };
  });
  const viewport = page.viewportSize();

  expect(sectionStyles.backgroundColor).toBe("rgb(6, 61, 36)");
  expect(sectionStyles.height).toBeLessThan(
    viewport && viewport.width >= 1024 ? 300 : 380,
  );
  expect(primaryCtaLineHeight.height).toBeLessThan(
    primaryCtaLineHeight.lineHeight * 3,
  );
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
