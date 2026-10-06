import { expect, test } from "@playwright/test";

test("Results navigation opens dated property evidence and its source PDF", async ({
  page,
}) => {
  await page.goto("/");
  const isMobile = page.viewportSize()!.width < 1024;
  if (isMobile)
    await page.getByRole("button", { name: "Open navigation" }).click();
  const navigation = page.getByRole("navigation", {
    name: isMobile ? "Mobile navigation" : "Primary",
  });
  await navigation.getByRole("link", { name: "Results", exact: true }).click();
  await expect(page).toHaveURL(/\/results$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Less energy waste.More room for value.",
  );
  await expect(page.locator(".results-metric")).toHaveText("40.7%");
  await expect(page.locator(".results-costs")).toContainText("June 2019");
  await expect(page.locator(".results-costs")).toContainText("June 2021");
  await expect(page.locator(".results-costs")).toContainText("$3,173.93");
  await expect(page.getByRole("table").locator("tbody tr")).toHaveCount(3);
  await expect(
    page.getByRole("table").locator("tbody tr").first(),
  ).toContainText("$3.36$2.9413%");
  const source = page.getByRole("link", { name: /View source, page 30/ });
  await expect(source).toHaveAttribute(
    "href",
    "/resources/duke-energy-presentation-2023.pdf#page=30",
  );
  const pdf = await page.request.get(
    "/resources/duke-energy-presentation-2023.pdf",
  );
  expect(pdf.ok()).toBe(true);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  await expect(page.locator("main")).toContainText("not a savings guarantee");
  await page
    .getByRole("link", { name: /Request a Proposal \/ Site Survey/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/request-for-proposal$/);
});
