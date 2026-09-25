import { expect, test } from "@playwright/test";

test("homepage company teaser opens the complete company story", async ({
  page,
}) => {
  await page.goto("/#company");
  const teaser = page.locator("#company");
  await expect(
    teaser.getByRole("link", { name: /Know more about the company/ }),
  ).toHaveAttribute("href", "/company");
  await teaser
    .getByRole("link", { name: /Know more about the company/ })
    .click();
  await expect(page).toHaveURL(/\/company$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Who we are." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vision" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mission" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Our values." }),
  ).toBeVisible();
  for (const value of [
    "Innovation",
    "Efficiency",
    "Reliability",
    "Comfort",
    "Sustainability",
  ]) {
    await expect(page.getByText(value, { exact: true })).toBeVisible();
  }
  await expect(
    page.getByRole("link", { name: /Request a proposal/ }).last(),
  ).toHaveAttribute("href", "/request-for-proposal");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("company gallery automatically advances on the new page", async ({
  page,
}) => {
  await page.goto("/company");
  const gallery = page.getByTestId("company-gallery");
  await expect(gallery).toHaveAttribute("data-active-slide", "Building");
  await expect(gallery).toHaveAttribute("data-active-slide", "Tree scene", {
    timeout: 5000,
  });
});
