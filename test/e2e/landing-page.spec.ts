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
    contactSection.getByText(
      "Request a data-backed savings projection. See your building's exact runtime reduction opportunity and utility incentive alignment - at no cost.",
    ),
  ).toBeVisible();

  await expect(
    contactSection.getByRole("link", { name: "Get a Free Savings Analysis" }),
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
  await expect(experienceBadge).toContainText("YEARS");
  await expect(experienceBadge).toContainText("of Energy Intelligence");

  const sectionStyles = await contactSection.evaluate((section) => {
    const styles = window.getComputedStyle(section);
    return {
      backgroundImage: styles.backgroundImage,
      height: section.getBoundingClientRect().height,
    };
  });
  const primaryCta = contactSection.getByRole("link", {
    name: "Get a Free Savings Analysis",
  });
  const primaryCtaLineHeight = await primaryCta.evaluate((link) => {
    const styles = window.getComputedStyle(link);
    return {
      height: link.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(styles.lineHeight),
    };
  });

  expect(sectionStyles.backgroundImage).toContain("radial-gradient");
  expect(sectionStyles.backgroundImage).toContain("rgb(22, 76, 104)");
  expect(sectionStyles.height).toBeGreaterThanOrEqual(400);
  expect(primaryCtaLineHeight.height).toBeLessThan(
    primaryCtaLineHeight.lineHeight * 3,
  );
});

test("presents the reference footer navigation columns", async ({ page }) => {
  await page.goto("/");

  const footer = page.locator("footer#company");
  await expect(footer.getByLabel("Lodging Technologies home")).toBeVisible();
  await expect(
    footer.getByText(
      "Intelligent energy management built for commercial properties, hospitality, and institutional residential buildings.",
    ),
  ).toBeVisible();
  await expect(
    footer.getByText("Proudly serving North America including the Caribbean."),
  ).toBeVisible();

  const footerNavigation = footer.getByRole("navigation", {
    name: "Footer navigation",
  });

  for (const heading of ["Technology", "Solutions", "Company", "Resources"]) {
    await expect(
      footerNavigation.getByRole("heading", { name: heading }),
    ).toBeVisible();
  }

  await expect(
    footerNavigation.getByRole("link", { name: "Energy Optimization" }),
  ).toBeVisible();
  await expect(
    footerNavigation.getByRole("link", { name: "Multifamily Housing" }),
  ).toBeVisible();
  await expect(
    footerNavigation.getByRole("link", { name: "Contact & Support" }),
  ).toBeVisible();
  await expect(
    footerNavigation.getByRole("link", { name: "ROI Calculator" }),
  ).toBeVisible();
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

  const nightLayer = page.locator('[data-hero-layer="night"]');
  await expect(nightLayer).toHaveCSS("opacity", "0");

  await page.getByRole("button", { name: "Switch to night mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(nightLayer).toHaveCSS("opacity", "1");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('[data-hero-layer="night"]')).toHaveCSS(
    "opacity",
    "1",
  );
});
