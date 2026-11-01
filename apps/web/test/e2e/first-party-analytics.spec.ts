import { test, expect } from "@playwright/test";
test("consent gates collection and withdrawal stops it", async ({ page }) => {
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
  await page.getByRole("button", { name: "Decline / withdraw" }).click();
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
test("report endpoint rejects unauthenticated requests", async ({
  request,
}) => {
  const response = await request.get("/api/admin/analytics");
  expect(response.status()).toBe(403);
});
