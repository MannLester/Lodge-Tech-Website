import { expect, test } from "@playwright/test";

test("room and connected stories keep readable text apart from their illustrations", async ({
  page,
}) => {
  await page.goto("/");
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (mode) => (document.documentElement.dataset.theme = mode),
      theme,
    );
    const photo = await page.locator(".occupancy-photo").boundingBox();
    const caption = await page.locator(".occupancy-caption").boundingBox();
    expect(caption!.y).toBeGreaterThanOrEqual(photo!.y + photo!.height);
    const flow = page.locator(".platform-flow-figure");
    await expect(
      flow.getByRole("heading", {
        name: "From room signal to building insight.",
      }),
    ).toBeVisible();
    for (const selector of [
      ".occupancy-caption",
      ".platform-flow-figure figcaption",
    ]) {
      const contrast = await page.locator(selector).evaluate((element) => {
        const background = getComputedStyle(element).backgroundColor;
        const text = element.querySelector("p:not(.chapter-label)")!;
        const style = getComputedStyle(text);
        const luminance = (color: string) => {
          const c = color
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number)
            .map((value) => {
              const channel = value / 255;
              return channel <= 0.04045
                ? channel / 12.92
                : ((channel + 0.055) / 1.055) ** 2.4;
            });
          return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
        };
        const foreground = luminance(style.color);
        const surface = luminance(background);
        return {
          ratio:
            (Math.max(foreground, surface) + 0.05) /
            (Math.min(foreground, surface) + 0.05),
          fontSize: Number.parseFloat(style.fontSize),
        };
      });
      expect(contrast.ratio).toBeGreaterThanOrEqual(4.5);
      expect(contrast.fontSize).toBeGreaterThanOrEqual(15);
    }
  }
  await expect(
    page.locator(".supporting-product-image img").first(),
  ).toHaveAttribute("alt", /Power Pack relay for lighting/);
  await expect(
    page.locator(".supporting-product-image img").first(),
  ).toHaveAttribute("src", /appliance-power-pack/);
});

test("public pages fit both themes and footer links resolve to real destinations", async ({
  page,
}) => {
  const routes = [
    "/",
    "/results",
    "/company",
    "/solutions/gem-stat-et",
    "/solutions/gem-link-wireless",
    "/solutions/lighting-controls",
    "/solutions/appliance-controls",
    "/request-for-proposal",
  ];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.ok(), route).toBe(true);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (mode) => (document.documentElement.dataset.theme = mode),
        theme,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        `${route} ${theme}`,
      ).toBe(false);
    }
  }
  await page.goto("/");
  const hrefs = await page
    .locator("footer nav a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  for (const href of hrefs) {
    if (href.startsWith("/#"))
      await expect(page.locator(href.slice(1))).toHaveCount(1);
    else expect((await page.request.get(href)).ok(), href).toBe(true);
  }
  await page.goto("/company");
  await expect(page.locator("#our-story")).toContainText(
    "hotel research and development",
  );
  await expect(page.locator("#our-story")).not.toContainText(
    /Video concept|Film William/,
  );
});
