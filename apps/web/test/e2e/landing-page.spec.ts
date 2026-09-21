import { expect, test } from "@playwright/test";

test("shows the benefit, products, and proposal path without overflow", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator("#technology");
  await expect(
    hero.getByRole("heading", {
      level: 1,
      name: "Save energy without sacrificing comfort.",
    }),
  ).toBeVisible();
  await expect(
    hero.getByRole("link", { name: "GEM Link® Wireless" }),
  ).toBeVisible();
  await expect(hero.getByRole("link", { name: "GEM Stat™ ET" })).toBeVisible();
  await expect(
    hero.getByText("Reduction in HVAC Operating Time"),
  ).toBeVisible();
  await hero
    .getByRole("link", { name: "Request a Proposal / Site Survey" })
    .click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("form", { name: "Proposal or site survey request" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test("keeps product branding and a contact route in public-page footers", async ({
  page,
}) => {
  for (const path of ["/", "/solutions/gem-stat-et"]) {
    await page.goto(path);
    const footer = page.locator("footer");
    await expect(footer.getByLabel("Lodging Technologies home")).toBeVisible();
    await expect(
      footer.getByRole("link", { name: "GEM Link® Wireless", exact: true }),
    ).toBeVisible();
    await expect(
      footer.getByRole("link", { name: "GEM Stat™ ET", exact: true }),
    ).toBeVisible();
    await expect(
      footer.getByRole("link", { name: "Request a Proposal / Site Survey" }),
    ).toHaveAttribute("href", "/#contact");
  }
});

test("defaults to light even on a dark device and preserves a chosen theme", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("switch", { name: "Switch to night mode" })
    .filter({ visible: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("switch", { name: "Switch to day mode" })
    .filter({ visible: true })
    .click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("allows keyboard users to pause and resume the guestroom motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const image = page.locator("#hero-room-image");
  const pause = page.getByRole("button", { name: "Pause guestroom animation" });
  await pause.focus();
  await pause.press("Enter");
  await expect(image).toHaveCSS("animation-play-state", "paused");
  const frozen = await image.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => image.evaluate((el) => getComputedStyle(el).transform))
    .toBe(frozen);
  await page
    .getByRole("button", { name: "Play guestroom animation" })
    .press("Enter");
  await expect(image).toHaveCSS("animation-play-state", "running");
});

test("disables the guestroom animation for reduced-motion preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#hero-room-image")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(
    page.getByRole("button", { name: "Pause guestroom animation" }),
  ).toBeHidden();
});

test("provides navigation appropriate to the viewport", async ({ page }) => {
  await page.goto("/");

  const viewport = page.viewportSize();
  if (!viewport) throw new Error("Viewport is required for this test.");

  if (viewport.width < 1024) {
    const menuButton = page.getByRole("button", { name: "Open navigation" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
  } else {
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
  }
});

test("validates and completes the proposal inquiry form", async ({ page }) => {
  await page.route("**/api/inquiries", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ ok: true }),
      contentType: "application/json",
      status: 201,
    });
  });
  await page.goto("/");

  const form = page.getByRole("form", {
    name: "Proposal or site survey request",
  });
  await form.getByRole("button", { name: "Send My Request" }).click();

  await expect(form.getByText("Enter your name.")).toBeVisible();
  await expect(form.getByText("Enter your email.")).toBeVisible();
  await expect(form.getByText("Enter your property or company.")).toBeVisible();
  await expect(form.getByText("Select a property type.")).toBeVisible();
  await expect(
    form.getByText("Tell us a little about the project."),
  ).toBeVisible();

  await form.getByLabel("Name").fill("Morgan Lee");
  await form.getByLabel("Work email").fill("morgan@example.com");
  await form.getByLabel("Property or company").fill("Harbor Hotel");
  await form.getByLabel("Property type").selectOption("hospitality");
  await form
    .getByLabel("Project notes")
    .fill("We want to review HVAC and lighting savings.");
  await form.getByRole("button", { name: "Send My Request" }).click();

  await expect(
    form.getByText(
      "Thanks. Your request has been submitted. Our team will follow up about your property.",
    ),
  ).toBeVisible();
});
