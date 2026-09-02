import { expect, test } from "@playwright/test";

test("shows the project foundation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Project foundation is ready." }),
  ).toBeVisible();
  await expect(page.getByText("Lodging Technologies")).toBeVisible();
});
