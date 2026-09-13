import { expect, test } from "@playwright/test";

test("mobile homepage carousels advance automatically", async ({ page }) => {
  const viewport = page.viewportSize();
  test.skip(!viewport || viewport.width >= 768, "Mobile behavior only");

  await page.goto("/");

  const carousel = page.getByRole("region", { name: "Products" });
  await carousel.scrollIntoViewIfNeeded();
  const track = carousel.locator(".snap-row");
  await expect
    .poll(() =>
      track.evaluate((element) => element.scrollWidth > element.clientWidth),
    )
    .toBe(true);
  const initialScrollLeft = await track.evaluate(
    (element) => element.scrollLeft,
  );

  await expect
    .poll(() => track.evaluate((element) => element.scrollLeft), {
      timeout: 5000,
    })
    .toBeGreaterThan(initialScrollLeft);
});

test("the Platform Demo text link has no button border", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Request Platform Demo" }),
  ).toHaveCSS("border-top-width", "0px");
});
