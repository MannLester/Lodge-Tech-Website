import { expect, test } from "@playwright/test";

const products = [
  { label: "GEM Stat ET", slug: "gem-stat-et" },
  { label: "GEM Link Wireless", slug: "gem-link-wireless" },
  { label: "Lighting Controls", slug: "lighting-controls" },
  { label: "Appliance Controls", slug: "appliance-controls" },
] as const;

for (const product of products) {
  test(`${product.label} renders the complete product template`, async ({
    page,
  }) => {
    await page.goto(`/solutions/${product.slug}`);

    await expect(
      page.getByRole("heading", { level: 1, name: product.label }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "Product navigation" })
        .getByRole("link", { name: product.label }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("heading", {
        name: "Designed for practical building operations.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "See how the solutions work together.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Plan around your property—not generic estimates.",
      }),
    ).toBeVisible();
    await expect(page.getByText(/pending verification/i)).toHaveCount(0);
    await expect(page.getByText(/development placeholder/i)).toHaveCount(0);

    const hasDocumentOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasDocumentOverflow).toBe(false);
  });
}

test("homepage cards and product navigation connect the four routes", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Learn more about GEM Stat ET" })
    .click();
  await expect(page).toHaveURL(/\/solutions\/gem-stat-et$/);

  await page
    .getByRole("navigation", { name: "Product navigation" })
    .getByRole("link", { name: "Lighting Controls" })
    .click();
  await expect(page).toHaveURL(/\/solutions\/lighting-controls$/);
  await expect(
    page
      .getByRole("navigation", { name: "Product navigation" })
      .getByRole("link", { name: "Lighting Controls" }),
  ).toHaveAttribute("aria-current", "page");

  await page.getByRole("link", { name: "Back to Solutions" }).click();
  await expect(page).toHaveURL(/\/#solutions$/);
});

test("mobile product layouts place visuals before their descriptions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/solutions/gem-stat-et");

  const introBox = await page.locator("[data-product-intro]").boundingBox();
  const productVisualBox = await page
    .locator("[data-product-visual]")
    .boundingBox();
  expect(productVisualBox?.y).toBeLessThan(introBox?.y ?? 0);

  const showcaseCopies = page.locator("[data-showcase-copy]");
  const showcaseVisuals = page.locator("[data-showcase-visual]");
  for (let index = 0; index < (await showcaseCopies.count()); index += 1) {
    const copyBox = await showcaseCopies.nth(index).boundingBox();
    const visualBox = await showcaseVisuals.nth(index).boundingBox();
    expect(visualBox?.y).toBeLessThan(copyBox?.y ?? 0);
  }
});

test("primary Solutions navigation exposes every product route", async ({
  page,
}) => {
  await page.goto("/");
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("Viewport is required for this test.");

  if (viewport.width >= 1024) {
    const primary = page.getByRole("navigation", { name: "Primary" });
    await primary.getByText("Solutions", { exact: true }).click();
    await expect(
      primary.getByRole("link", { name: "GEM Stat ET" }),
    ).toHaveAttribute("href", "/solutions/gem-stat-et");
    await primary.getByRole("link", { name: "Appliance Controls" }).click();
  } else {
    await page.getByRole("button", { name: "Open navigation" }).click();
    const mobile = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(
      mobile.getByRole("link", { name: "GEM Stat ET" }),
    ).toHaveAttribute("href", "/solutions/gem-stat-et");
    await mobile.getByRole("link", { name: "Appliance Controls" }).click();
  }

  await expect(page).toHaveURL(/\/solutions\/appliance-controls$/);
});

test("ecosystem controls expose their selected details", async ({ page }) => {
  await page.goto("/solutions/gem-stat-et");

  await page.getByRole("button", { name: "Lighting Controls" }).click();
  await expect(
    page.getByRole("link", { name: "Explore Lighting Controls" }),
  ).toBeVisible();
});

test("product CTA carries safe context into the existing inquiry form", async ({
  page,
}) => {
  await page.goto("/solutions/gem-stat-et");
  await page
    .getByRole("link", { name: "Request a Product Demo" })
    .first()
    .click();

  await expect(page).toHaveURL(/product=gem-stat-et&intent=demo#contact$/);
  await expect(page.getByLabel("Project notes")).toHaveValue(
    "We would like to request a product demo for GEM Stat ET.",
  );
});

test("product pages use the light presentation and proposal CTA", async ({
  page,
}) => {
  await page.goto("/solutions/gem-stat-et");
  await expect(
    page
      .locator("[data-product-intro]")
      .getByRole("link", { name: "Request for Proposal / Site Survey" })
      .first(),
  ).toHaveAttribute("href", "/?product=gem-stat-et&intent=savings#contact");
  await expect(page.getByRole("switch")).toHaveCount(0);
});

test("unknown product slugs return not found", async ({ page }) => {
  const response = await page.goto("/solutions/unknown-product");
  expect(response?.status()).toBe(404);
});
