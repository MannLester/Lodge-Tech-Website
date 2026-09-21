import { expect, test } from "@playwright/test";

// Full login/logout coverage requires a real or mocked Microsoft OAuth
// exchange; these tests only cover the unauthenticated gate.
test("requires Microsoft sign-in before showing the admin dashboard", async ({
  page,
}) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { name: "Sign in to the light CRM" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in with Microsoft" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Admin dashboard" }),
  ).toBeHidden();
});

test("shows an inline error when Microsoft sign-in is denied", async ({
  page,
}) => {
  await page.goto("/admin?auth=denied");

  await expect(
    page.getByRole("heading", { name: "Sign in to the light CRM" }),
  ).toBeVisible();
  await expect(page.getByText("isn't authorized for the CRM")).toBeVisible();
});
