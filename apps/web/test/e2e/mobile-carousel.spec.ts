import { expect, test } from "@playwright/test";

test("mobile product stories remain readable without a carousel", async ({
  page,
}) => {
  const viewport = page.viewportSize();
  test.skip(!viewport || viewport.width >= 768, "Mobile behavior only");

  await page.goto("/");

  const products = page.locator("#solutions");
  for (const label of [
    "GEM Stat ET",
    "GEM Link Wireless",
    "Lighting Controls",
    "Appliance Controls",
  ]) {
    const link = products.getByRole("link", {
      name: "Learn more about " + label,
    });
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
  }
  expect(
    await products.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(false);
});

test("the Platform Demo text link has no button border", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Request Platform Demo" }),
  ).toHaveCSS("border-top-width", "0px");
});
