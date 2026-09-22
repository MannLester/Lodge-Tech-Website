import { expect, test } from "@playwright/test";

test("keeps the header proposal action clear and uses available desktop width", async ({
  page,
}) => {
  await page.goto("/");

  const viewportWidth = page.viewportSize()?.width ?? 0;
  if (viewportWidth >= 1024) {
    const action = page
      .locator("header")
      .getByRole("link", { name: "Request for Proposal" });
    await expect(action).toBeVisible();
    await expect(action).toHaveCSS("white-space", "nowrap");

    if (viewportWidth >= 1440) {
      const headerWidth = await page
        .locator("[data-header-shell]")
        .evaluate((element) => element.getBoundingClientRect().width);
      expect(headerWidth).toBeGreaterThan(1300);
    }
  } else {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "Request for Proposal" }),
    ).toBeVisible();
  }
});

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
    .getByRole("link", { name: "Request for Proposal / Site Survey" })
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
      footer.getByRole("link", { name: "Request for Proposal / Site Survey" }),
    ).toHaveAttribute("href", "/#contact");
  }
});

test("defaults to light, preserves theme choice, and keeps proof values legible", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const nightHouse = page.locator('[data-hero-layer="night"]');
  const proofValue = page.locator(".hero-stat-value").first();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(nightHouse).toHaveCSS("opacity", "0");
  await expect(proofValue).toHaveCSS("color", "rgb(255, 255, 255)");

  await page
    .getByRole("switch", { name: "Switch to night mode" })
    .filter({ visible: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(nightHouse).toHaveCSS("opacity", "1");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(nightHouse).toHaveCSS("opacity", "1");

  await page
    .getByRole("switch", { name: "Switch to day mode" })
    .filter({ visible: true })
    .click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(nightHouse).toHaveCSS("opacity", "0");
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

test("emphasizes Company values with responsive type and motion-aware pulses", async ({
  page,
}) => {
  await page.goto("/#company");
  const heading = page.getByText("Our Values", { exact: true });
  const values = page.locator("[data-company-values]");
  const firstValue = values.locator("li").first();
  const firstCheck = values.locator(".company-value-check").first();
  const viewport = page.viewportSize();

  if (!viewport) throw new Error("Viewport is required for this test.");

  await expect(heading).toHaveCSS(
    "font-size",
    viewport.width >= 1024 ? "30px" : "24px",
  );
  await expect(values).toHaveCSS("margin-top", "40px");
  await expect(firstValue).toHaveCSS(
    "font-size",
    viewport.width >= 1024 ? "18px" : "16px",
  );
  expect(
    await firstCheck.evaluate(
      (element) => getComputedStyle(element, "::after").animationName,
    ),
  ).toBe("company-value-pulse");

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await firstCheck.evaluate(
      (element) => getComputedStyle(element, "::after").animationName,
    ),
  ).toBe("none");
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
  await form
    .getByRole("button", { name: "Request Proposal / Site Survey" })
    .click();

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
  await form
    .getByRole("button", { name: "Request Proposal / Site Survey" })
    .click();

  await expect(
    form.getByText(
      "Thanks. Your request has been submitted. Our team will follow up about your property.",
    ),
  ).toBeVisible();
});
