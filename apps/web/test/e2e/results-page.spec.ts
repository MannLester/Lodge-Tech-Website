import { expect, test } from "@playwright/test";

test("Results navigation returns to Section 5 from public pages", async ({
  page,
}) => {
  for (const path of ["/", "/company", "/solutions/lighting-controls"]) {
    await page.goto(path);
    const isMobile = page.viewportSize()!.width < 1024;
    if (isMobile)
      await page.getByRole("button", { name: "Open navigation" }).click();
    const navigation = page.getByRole("navigation", {
      name: isMobile ? "Mobile navigation" : "Primary",
    });
    await navigation
      .getByRole("link", { name: "Results", exact: true })
      .click();
    await expect(page).toHaveURL(/\/#results$/);
    await expect(page.locator("#results")).toBeInViewport();
    await expect(page.locator("#results .chapter-label")).toHaveText(
      "05 / Start with your building",
    );
    await expect(
      page
        .locator("#results")
        .getByRole("link", { name: /Explore property results/ }),
    ).toHaveCount(0);
  }
  await page
    .locator("#results")
    .getByRole("link", { name: /Start a Savings Review/ })
    .click();
  await expect(page).toHaveURL(/#contact$/);
});

test("the Results URL redirects while the source PDF remains available", async ({
  page,
}) => {
  const response = await page.request.get("/results", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toMatch(/\/#results$/);
  await page.goto("/results");
  await expect(page).toHaveURL(/\/#results$/);
  await expect(page.locator("#results")).toBeInViewport();
  const pdf = await page.request.get(
    "/resources/duke-energy-presentation-2023.pdf",
  );
  expect(pdf.ok()).toBe(true);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
});
