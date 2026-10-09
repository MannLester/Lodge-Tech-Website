import { expect, test } from "@playwright/test";

test("loads the Insight Tag once per document and on a successful conversion", async ({
  page,
}) => {
  // Verify our integration without sending test visits to LinkedIn.
  let tagLoads = 0;
  await page.route("https://snap.licdn.com/**", async (route) => {
    tagLoads += 1;
    await route.fulfill({ body: "", contentType: "application/javascript" });
  });
  await page.route("**/api/inquiries", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ ok: true }),
      contentType: "application/json",
      status: 201,
    });
  });

  for (const path of ["/company", "/request-for-proposal", "/"]) {
    const previousLoads = tagLoads;
    await page.goto(path);
    await expect.poll(() => tagLoads).toBe(previousLoads + 1);
    await expect(
      page.locator(
        'script[src="https://snap.licdn.com/li.lms-analytics/insight.min.js"]',
      ),
    ).toHaveCount(1);
    await expect
      .poll(() =>
        page.evaluate(() => Reflect.get(window, "_linkedin_data_partner_ids")),
      )
      .toEqual(["9825954"]);
  }

  const form = page.getByRole("form", { name: "General inquiry" });
  await form.getByLabel("Name").fill("Tracking Verification");
  await form.getByLabel("Work email").fill("tracking@example.com");
  await form.getByLabel("Property or company").fill("Test Property");
  await form.getByLabel("Property type").selectOption("hospitality");
  await form
    .getByLabel("Project notes")
    .fill("Verify the conversion redirect.");
  const previousLoads = tagLoads;
  await form
    .getByRole("button", { name: "Request Proposal / Site Survey" })
    .click();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(
    page.getByRole("heading", { name: "Thank you for reaching out." }),
  ).toBeVisible();
  await expect.poll(() => tagLoads).toBe(previousLoads + 1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(
    page.getByRole("link", { name: "Back to home" }),
  ).toHaveAttribute("href", "/");
});
