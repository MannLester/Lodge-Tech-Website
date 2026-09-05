import { expect, test } from "@playwright/test";

test("requires demo login before showing the admin dashboard", async ({
  page,
}) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { name: "Sign in to the light CRM" }),
  ).toBeVisible();
  await expect(
    page.getByText("This button creates a signed demo session"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Login as demo admin" }).click();

  await expect(
    page.getByRole("heading", { name: "Admin dashboard" }),
  ).toBeVisible();
  await expect(page.getByText("demo-admin")).toBeVisible();

  const sessionCookie = await page
    .context()
    .cookies()
    .then((cookies) =>
      cookies.find((cookie) => cookie.name === "lodge_admin_session"),
    );

  expect(sessionCookie?.httpOnly).toBe(true);
  expect(sessionCookie?.sameSite).toBe("Lax");

  await page.getByRole("button", { name: "Logout" }).click();

  await expect(
    page.getByRole("heading", { name: "Sign in to the light CRM" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Admin dashboard" }),
  ).toBeHidden();
});

test("rejects an altered admin session cookie", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "lodge_admin_session",
      value: "tampered",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { name: "Sign in to the light CRM" }),
  ).toBeVisible();
});

test("uses the light CRM navigation and redirects legacy views", async ({
  page,
}) => {
  await page.goto("/admin");
  await page.getByRole("button", { name: "Login as demo admin" }).click();

  await page.getByRole("link", { name: "Leads" }).click();
  await expect(page).toHaveURL(/view=leads/);
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();

  await page.getByRole("link", { name: "Tasks" }).click();
  await expect(page).toHaveURL(/view=tasks/);
  await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();

  await page.goto("/admin?view=inquiries");
  await expect(page).toHaveURL(/view=leads/);
  await page.goto("/admin?view=follow-ups");
  await expect(page).toHaveURL(/view=tasks/);
});
