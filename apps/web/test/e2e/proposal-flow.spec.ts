import { expect, test } from "@playwright/test";

test("shows the supplied product photo behind readable proposal copy", async ({
  page,
}) => {
  await page.goto("/request-for-proposal");
  const hero = page.locator(".proposal-hero");
  const photo = hero.locator("img");
  await expect(photo).toBeVisible();
  await expect
    .poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect(hero.getByRole("heading", { level: 1 })).toHaveCSS(
    "color",
    "rgb(247, 251, 252)",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("proposal CTAs lead to the new page while general inquiry remains below", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("#contact").getByRole("form", { name: "General inquiry" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Request for Proposal / Site Survey" })
    .first()
    .click();
  await expect(page).toHaveURL(/\/request-for-proposal$/);
  await expect(
    page.getByRole("form", { name: "Request for proposal" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Send an inquiry/ }),
  ).toHaveAttribute("href", "/#contact");
});

test("proposal form sends structured property information", async ({
  page,
}) => {
  let submitted: Record<string, unknown> | undefined;
  await page.route("**/api/proposals", async (route) => {
    const body = route.request().postDataBuffer();
    const request = new Request("http://localhost/api/proposals", {
      method: "POST",
      headers: { "content-type": route.request().headers()["content-type"] },
      body: body ? new Uint8Array(body) : null,
    });
    const form = await request.formData();
    submitted = JSON.parse(String(form.get("proposal"))) as Record<
      string,
      unknown
    >;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });
  await page.goto("/request-for-proposal");
  const form = page.getByRole("form", { name: "Request for proposal" });
  await form.locator('[name="firstName"]').fill("Morgan");
  await form.locator('[name="lastName"]').fill("Lee");
  await form.locator('[name="email"]').fill("morgan@example.com");
  await form.locator('[name="phone"]').fill("555-123-4567");
  await form.locator('[name="propertyName"]').fill("Harbor Hotel");
  await form.locator('[name="street"]').fill("1 Main St");
  await form.locator('[name="city"]').fill("Boston");
  await form.locator('[name="region"]').fill("MA");
  await form.locator('[name="postalCode"]').fill("02110");
  await form.locator('[name="country"]').fill("US");
  await form.locator('[name="entry"]').selectOption("interior");
  await form.locator('[name="balcony"]').selectOption("none");
  await form.locator('[name="guestControl"]').selectOption("wall");
  await form.getByRole("button", { name: /Send proposal request/ }).click();
  await expect(
    form.getByText(/Your proposal request has been received/),
  ).toBeVisible();
  expect(submitted?.propertyName).toBe("Harbor Hotel");
  expect(submitted?.entry).toBe("interior");
});
