import { expect, test, type Page } from "@playwright/test";

const stubPixel = `
  window.__metaCalls = [];
  window.fbq.callMethod = function() {
    window.__metaCalls.push(Array.from(arguments));
  };
  for (const call of window.fbq.queue) window.fbq.callMethod.apply(null, call);
  window.fbq.queue = [];
`;

async function calls(page: Page) {
  return page.evaluate(
    () => (Reflect.get(window, "__metaCalls") ?? []) as unknown[][],
  );
}

async function events(page: Page) {
  return (await calls(page)).filter((call) => call[0] === "track");
}

async function fillInquiry(page: Page) {
  const form = page.getByRole("form", { name: "General inquiry" });
  await form.getByLabel("Name").fill("Pixel Verification");
  await form.getByLabel("Work email").fill("pixel@example.com");
  await form.getByLabel("Property or company").fill("Test Property");
  await form.getByLabel("Phone (optional)").fill("+1 202 555 0142");
  await form.getByLabel("Property type").selectOption("hospitality");
  await form
    .getByLabel("Project notes")
    .fill("Verify successful conversion tracking.");
  return form;
}

test.beforeEach(async ({ page }) => {
  await page.route("https://snap.licdn.com/**", (route) =>
    route.fulfill({ body: "", contentType: "application/javascript" }),
  );
  await page.route("https://connect.facebook.net/**", (route) =>
    route.fulfill({ body: stubPixel, contentType: "application/javascript" }),
  );
});

test("queues a page view while the SDK loads and tracks client-side navigation once", async ({
  page,
}) => {
  let release: () => void = () => {};
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  let loads = 0;
  await page.route("https://connect.facebook.net/**", async (route) => {
    loads += 1;
    await delayed;
    await route.fulfill({
      body: stubPixel,
      contentType: "application/javascript",
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect
    .poll(() =>
      page.evaluate(() => {
        const fbq = Reflect.get(window, "fbq");
        return fbq?.queue
          ? Array.from(fbq.queue, (entry) =>
              Array.from(entry as ArrayLike<unknown>),
            )
          : [];
      }),
    )
    .toContainEqual(["track", "PageView"]);
  release();
  await expect.poll(() => events(page)).toEqual([["track", "PageView"]]);
  await expect
    .poll(() => calls(page))
    .toContainEqual(["init", "1101924195888270"]);
  expect(await calls(page)).toContainEqual([
    "set",
    "autoConfig",
    false,
    "1101924195888270",
  ]);
  let navigation = page.getByRole("navigation", { name: "Primary" });
  if (!(await navigation.isVisible())) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  }
  await navigation.getByRole("link", { name: "Company", exact: true }).click();
  await expect(page).toHaveURL(/\/company$/);
  await expect
    .poll(() => events(page))
    .toEqual([
      ["track", "PageView"],
      ["track", "PageView"],
    ]);
  expect(loads).toBe(1);
});

test("sends a lead only after success, without form data, and never again on refresh", async ({
  page,
}) => {
  await page.route("**/api/inquiries", (route) =>
    route.fulfill({
      body: JSON.stringify({ ok: true }),
      contentType: "application/json",
      status: 201,
    }),
  );
  await page.goto("/thank-you");
  await expect.poll(() => events(page)).toEqual([["track", "PageView"]]);
  await page.goto("/");
  const form = await fillInquiry(page);
  await form
    .getByRole("button", { name: "Request Proposal / Site Survey" })
    .click();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect
    .poll(() => events(page))
    .toEqual([
      ["track", "PageView"],
      ["track", "Lead"],
    ]);
  // Both events have exactly two arguments; no form values are passed.
  expect((await events(page)).every((call) => call.length === 2)).toBe(true);
  await page.reload();
  await expect.poll(() => events(page)).toEqual([["track", "PageView"]]);
});

test("failed submissions cannot create a lead on a subsequent thank-you visit", async ({
  page,
}) => {
  await page.route("**/api/inquiries", (route) =>
    route.fulfill({
      body: JSON.stringify({ ok: false, code: "SUBMISSION_FAILED" }),
      contentType: "application/json",
      status: 500,
    }),
  );
  await page.goto("/");
  const form = await fillInquiry(page);
  await form
    .getByRole("button", { name: "Request Proposal / Site Survey" })
    .click();
  await expect(
    form.getByText(
      "We couldn't submit your request. Your entries are still here; please try again.",
    ),
  ).toBeVisible();
  expect((await events(page)).some((call) => call[1] === "Lead")).toBe(false);
  await page.goto("/thank-you");
  await expect.poll(() => events(page)).toEqual([["track", "PageView"]]);
});
