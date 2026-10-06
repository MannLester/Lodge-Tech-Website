import { expect, test } from "@playwright/test";

test("room overlay and connected stories retain readable typography", async ({
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
    expect(caption!.y).toBeGreaterThanOrEqual(photo!.y);
    expect(caption!.y + caption!.height).toBeLessThanOrEqual(
      photo!.y + photo!.height + 1,
    );
    await expect(
      page.locator(".occupancy-caption p:not(.chapter-label)"),
    ).toHaveText(
      "Guests choose their comfort while they’re in the room. When they leave, occupancy sensing helps the controls follow the property’s configured energy-saving settings.",
    );
    const flow = page.locator(".platform-flow-figure");
    await expect(
      flow.getByRole("heading", {
        name: "From room signal to building insight.",
      }),
    ).toBeVisible();
    const graph = flow.getByRole("list", {
      name: "From room signals to property review",
    });
    await expect(graph.getByRole("listitem")).toHaveCount(4);
    await expect(graph.locator("svg")).toHaveCount(6);
    await expect(graph).not.toContainText("Appliance");
    await expect(
      graph.getByRole("link", { name: "Lighting controls" }),
    ).toHaveAttribute("href", "/solutions/lighting-controls");
    const nodes = await graph.getByRole("listitem").all();
    for (let index = 1; index < nodes.length; index += 1) {
      const previous = (await nodes[index - 1].boundingBox())!;
      const next = (await nodes[index].boundingBox())!;
      if (page.viewportSize()!.width >= 1120)
        expect(next.x).toBeGreaterThan(previous.x);
      else expect(next.y).toBeGreaterThan(previous.y + previous.height);
    }
    const reviewLine = await graph
      .locator(".connected-view-review-source")
      .evaluate((node) => {
        const style = getComputedStyle(node, "::after");
        return window.matchMedia("(max-width: 69.99rem)").matches
          ? style.borderLeftStyle
          : style.borderTopStyle;
      });
    expect(reviewLine).toBe("dashed");
    for (const selector of [
      ".occupancy-caption",
      ".platform-flow-figure figcaption",
    ]) {
      const contrast = await page.locator(selector).evaluate((element) => {
        const containerStyle = getComputedStyle(element);
        let background = containerStyle.backgroundColor;
        if (element.classList.contains("occupancy-caption")) {
          const shades = [
            ...containerStyle.backgroundImage.matchAll(
              /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/g,
            ),
          ]
            .map((match) => ({
              channels: match.slice(1, 4).map(Number),
              alpha: Number(match[4] ?? 1),
            }))
            .filter((shade) => shade.alpha > 0)
            .sort((a, b) => a.alpha - b.alpha);
          const shade = shades[0];
          const composite = shade.channels.map(
            (channel) => channel * shade.alpha + 255 * (1 - shade.alpha),
          );
          background = `rgb(${composite.join(", ")})`;
        }
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
