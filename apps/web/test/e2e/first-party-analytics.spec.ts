import { test, expect } from "@playwright/test";
test("consent gates collection and withdrawal stops it", async ({ page }) => {
  test.skip(
    process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_MODE === "opt-out",
    "Explicit opt-in mode only",
  );
  let requests = 0;
  await page.route("**/api/analytics/collect", async (route) => {
    requests++;
    await route.fulfill({ status: 204 });
  });
  await page.goto("/?utm_source=tiktok&utm_campaign=browser-test");
  await expect(
    page.getByRole("button", { name: "Allow analytics" }),
  ).toBeVisible();
  expect(requests).toBe(0);
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => requests).toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Analytics privacy settings" })
    .click();
  await page.getByRole("button", { name: "Turn off analytics" }).click();
  const count = requests;
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Analytics privacy settings" }),
  ).toBeVisible();
  expect(requests).toBe(count);
  expect(
    await page.evaluate(() => sessionStorage.getItem("lt.analytics.session")),
  ).toBeNull();
});
test("automatic mode starts visits and preserves a direct opt-out across reload", async ({
  page,
}) => {
  test.skip(
    process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_MODE !== "opt-out",
    "Automatic mode only",
  );
  let requests = 0;
  await page.route("**/api/analytics/collect", async (route) => {
    requests++;
    await route.fulfill({ status: 204 });
  });
  await page.goto(
    "/?utm_source=tiktok&utm_campaign=automatic-mode-browser-test",
  );
  await expect(
    page.getByRole("button", { name: "Turn off analytics", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Allow analytics", exact: true }),
  ).toHaveCount(0);
  await expect.poll(() => requests).toBeGreaterThan(0);
  await page.screenshot({
    path: `.cache/analytics-control-${page.viewportSize()?.width}.png`,
  });
  await page
    .getByRole("button", { name: "Analytics privacy settings", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Website visit analytics", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: `.cache/analytics-settings-${page.viewportSize()?.width}.png`,
  });
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  await page.screenshot({
    path: `.cache/analytics-settings-dark-${page.viewportSize()?.width}.png`,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Turn off analytics", exact: true })
    .click();
  const count = requests;
  await page.reload();
  await expect(
    page.getByText("Visit analytics: Off", { exact: true }),
  ).toBeVisible();
  expect(requests).toBe(count);
  expect(
    await page.evaluate(() => sessionStorage.getItem("lt.analytics.session")),
  ).toBeNull();
});
test("report endpoint rejects unauthenticated requests", async ({
  request,
}) => {
  const response = await request.get("/api/admin/analytics");
  expect(response.status()).toBe(403);
});
