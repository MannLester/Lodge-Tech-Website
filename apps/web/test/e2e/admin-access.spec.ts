import { expect, test } from "@playwright/test";

test("requires Google sign-in before showing the admin dashboard", async ({
  page,
}) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { name: "Sign in to the light CRM" }),
  ).toBeVisible();
  await expect(
    page.getByText("Use your approved Google account"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in with Google" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Admin dashboard" }),
  ).toBeHidden();
});

test("explains denied Google accounts", async ({ page }) => {
  await page.goto("/admin?auth=denied");

  await expect(
    page.getByText("This Google account is not approved for admin access."),
  ).toBeVisible();
});

test("explains failed Google session exchanges", async ({ page }) => {
  await page.goto("/admin?auth=error&reason=exchange_failed");

  await expect(
    page.getByText(
      "The secure Google sign-in exchange could not be completed.",
    ),
  ).toBeVisible();
});

test("keeps legacy admin view redirects behind authentication", async ({
  page,
}) => {
  await page.goto("/admin?view=inquiries");

  await expect(page).toHaveURL(/view=inquiries/);
  await expect(
    page.getByRole("heading", { name: "Sign in to the light CRM" }),
  ).toBeVisible();
});
