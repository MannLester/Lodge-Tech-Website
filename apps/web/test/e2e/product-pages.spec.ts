import { expect, test } from "@playwright/test";

const products = [
  { label: "GEM Stat™ ET", slug: "gem-stat-et" },
  { label: "GEM Link® Wireless – HVAC", slug: "gem-link-wireless" },
  { label: "GEM Link® Wireless – Lighting Control", slug: "lighting-controls" },
  {
    label: "GEM Link® – Appliance Control",
    slug: "appliance-controls",
  },
] as const;

for (const product of products) {
  test(`${product.label} renders the complete product template`, async ({
    page,
  }) => {
    await page.goto(`/solutions/${product.slug}`);

    await expect(
      page.getByRole("heading", { level: 1, name: product.label }),
    ).toBeVisible();
    if (
      product.slug !== "gem-stat-et" &&
      product.slug !== "appliance-controls"
    ) {
      await expect(
        page
          .getByRole("navigation", { name: "Product navigation" })
          .getByRole("link", { name: product.label }),
      ).toHaveAttribute("aria-current", "page");
    }
    await expect(
      page.getByRole("heading", {
        name: "Designed for practical building operations.",
      }),
    ).toBeVisible();
    await expect(page.locator("#ecosystem-heading")).toBeHidden();
    await expect(page.locator("#ecosystem-heading")).toHaveText(
      "See how the solutions work together.",
    );
    await expect(
      page.getByRole("heading", { name: "Details for technical evaluation." }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: new RegExp("Let’s see where " + product.label),
      }),
    ).toBeVisible();

    const hasDocumentOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasDocumentOverflow).toBe(false);
  });
}

test("homepage cards and product navigation connect the current solutions", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Learn more about GEM Stat™ ET" })
    .click();
  await expect(page).toHaveURL(/\/solutions\/gem-stat-et$/);

  await page
    .getByRole("navigation", { name: "Product navigation" })
    .getByRole("link", { name: "GEM Link® Wireless – Lighting Control" })
    .click();
  await expect(page).toHaveURL(/\/solutions\/lighting-controls$/);
  await expect(
    page
      .getByRole("navigation", { name: "Product navigation" })
      .getByRole("link", { name: "GEM Link® Wireless – Lighting Control" }),
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

test("GEM Stat™ ET leads with the thermostat hero photo", async ({ page }) => {
  await page.goto("/solutions/gem-stat-et");

  await expect(
    page
      .getByRole("img", {
        name: "GEM Stat™ ET thermostat with room temperature display",
      })
      .first(),
  ).toBeVisible();
});

test("Lighting Controls uses the Power Pack and omits retired Appliance links", async ({
  page,
}) => {
  await page.goto("/solutions/lighting-controls");
  const image = page.locator("[data-product-visual]").getByRole("img", {
    name: "Power Pack relay for lighting control with red, black, and white wiring",
  });
  await expect(image).toBeVisible();
  await expect(image).toHaveCSS("object-fit", "contain");
  await expect(image).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await image.evaluate((element: HTMLImageElement) => element.decode());
  await expect(
    page.locator('a[href="/solutions/appliance-controls"]'),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Appliance Control/ }),
  ).toHaveCount(0);
});

test("Appliance Control leads with the supplied Power Pack photo", async ({
  page,
}) => {
  await page.goto("/solutions/appliance-controls");

  await expect(
    page.getByRole("img", {
      name: "Power Pack appliance-control relay with red, black, and white wiring",
    }),
  ).toBeVisible();
});

test("primary Solutions navigation exposes only HVAC and lighting routes", async ({
  page,
}) => {
  await page.goto("/");
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("Viewport is required for this test.");

  if (viewport.width >= 1024) {
    const primary = page.getByRole("navigation", { name: "Primary" });
    await primary.getByText("Solutions", { exact: true }).click();
    await expect(primary.locator("details a")).toHaveCount(2);
    await expect(primary).not.toContainText(/GEM Stat|Appliance|DHW/);
    await primary
      .getByRole("link", { name: "GEM Link® Wireless – Lighting Controls" })
      .click();
  } else {
    await page.getByRole("button", { name: "Open navigation" }).click();
    const mobile = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobile).not.toContainText(/GEM Stat|Appliance|DHW/);
    await expect(mobile.locator('a[href^="/solutions/"]')).toHaveCount(2);
    await mobile
      .getByRole("link", { name: "GEM Link® Wireless – Lighting Controls" })
      .click();
  }

  await expect(page).toHaveURL(/\/solutions\/lighting-controls$/);
});

test("product ecosystem section is hidden while its code and diagram are retained", async ({
  page,
}) => {
  await page.goto("/solutions/gem-stat-et");

  const section = page.locator('section[aria-labelledby="ecosystem-heading"]');
  await expect(section).toHaveAttribute("hidden", "");
  await expect(section).toBeHidden();
  await expect(section.locator(".ecosystem-diagram")).toHaveCount(1);
  await expect(section).toContainText("PIR occupancy sensor");
  await expect(section).toContainText("Entry and balcony contacts");
  await expect(
    page.getByRole("group", { name: "Connected solution diagram" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Details for technical evaluation." }),
  ).toBeVisible();
});

test("product CTA carries safe context into the existing inquiry form", async ({
  page,
}) => {
  await page.goto("/solutions/gem-stat-et");
  await page.getByRole("link", { name: "Request a Demo" }).first().click();

  await expect(page).toHaveURL(/product=gem-stat-et&intent=demo#contact$/);
  await expect(page.getByLabel("Project notes")).toHaveValue(
    "We would like to request a product demo for GEM Stat™ ET.",
  );
});

test("proposal form offers the approved products and appliance applications", async ({
  page,
}) => {
  await page.goto("/request-for-proposal");

  for (const label of [
    "GEM Stat™ ET Thermostat Energy Management System",
    "GEM Link® Wireless – HVAC Control",
    "GEM Link® Wireless – Lighting Control",
    "GEM Link® – Appliance Control",
    "Two Burner Cooktop",
    "Individual in-room Electric Hot Water Heater",
  ]) {
    await expect(page.getByRole("checkbox", { name: label })).toBeVisible();
  }
});

test("retired water-heater solution redirects to Appliance Control", async ({
  page,
}) => {
  await page.goto("/solutions/dhw-controls");
  await expect(page).toHaveURL(/\/solutions\/appliance-controls$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "GEM Link® – Appliance Control",
    }),
  ).toBeVisible();
});

test("specifications and theme controls remain accessible", async ({
  page,
}) => {
  await page.goto("/solutions/gem-stat-et");

  const connectivity = page.locator("details").filter({
    hasText: "Connectivity and installation",
  });
  await expect(connectivity).not.toHaveAttribute("open", "");
  await connectivity.locator("summary").click();
  await expect(connectivity).toHaveAttribute("open", "");

  await page
    .getByRole("switch", { name: "Switch to night mode" })
    .filter({ visible: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("navigation", { name: "Product navigation" }),
  ).not.toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("unknown product slugs return not found", async ({ page }) => {
  const response = await page.goto("/solutions/unknown-product");
  expect(response?.status()).toBe(404);
});
