import { expect, test } from "@playwright/test";

test("renders the complete landing page without document overflow", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Reduce HVAC, Lighting, and Appliance Energy Expense 40% with GEM Link Wireless and GEM Stat ET.",
    }),
  ).toBeVisible();
  await expect(page.getByLabel("Proof ticker")).toContainText(
    "GEM Link Wireless and GEM Stat ET",
  );
  await expect(page.locator("#industries")).toBeVisible();
  await expect(page.locator("#results")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();

  const hasDocumentOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasDocumentOverflow).toBe(false);
});

test("presents the closing conversion section from the design reference", async ({
  page,
}) => {
  await page.goto("/");

  const contactSection = page.locator("#contact");
  await expect(
    contactSection.getByRole("heading", {
      name: "Ready to reduce HVAC, lighting, and appliance energy expense?",
    }),
  ).toBeVisible();
  await expect(
    contactSection.getByText(
      "Request a savings analysis for GEM Link Wireless, GEM Stat ET, and turnkey controls across your property portfolio.",
    ),
  ).toBeVisible();

  await expect(
    contactSection.getByRole("link", { name: "Get a Savings Analysis" }),
  ).toBeVisible();
  await expect(
    contactSection.getByRole("link", { name: "Request a Demo" }),
  ).toBeVisible();
  await expect(
    contactSection.getByRole("link", { name: "Talk to an Expert" }),
  ).toBeVisible();
  const experienceBadge = contactSection.getByLabel(
    "Since 1980 energy intelligence",
  );
  await expect(experienceBadge).toContainText("1980");
  await expect(experienceBadge).toContainText("LEGACY");
  await expect(experienceBadge).toContainText("40+ years");

  const sectionStyles = await contactSection.evaluate((section) => {
    const styles = window.getComputedStyle(section);
    return {
      backgroundImage: styles.backgroundImage,
      height: section.getBoundingClientRect().height,
    };
  });
  const primaryCta = contactSection.getByRole("link", {
    name: "Get a Savings Analysis",
  });
  const primaryCtaLineHeight = await primaryCta.evaluate((link) => {
    const styles = window.getComputedStyle(link);
    return {
      height: link.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(styles.lineHeight),
    };
  });

  expect(sectionStyles.backgroundImage).toContain("radial-gradient");
  expect(sectionStyles.backgroundImage).toContain("rgb(22, 76, 104)");
  expect(sectionStyles.height).toBeGreaterThanOrEqual(400);
  expect(primaryCtaLineHeight.height).toBeLessThan(
    primaryCtaLineHeight.lineHeight * 3,
  );
});

test("presents the reference footer navigation columns", async ({ page }) => {
  await page.goto("/");

  const footer = page.locator("footer#company");
  await expect(footer.getByLabel("Lodging Technologies home")).toBeVisible();
  await expect(
    footer.getByText(
      "GEM Link Wireless and GEM Stat ET energy management for lodging, multifamily, senior living, student housing, and commercial properties.",
    ),
  ).toBeVisible();
  await expect(
    footer.getByText("Proudly serving North America including the Caribbean."),
  ).toBeVisible();

  const footerNavigation = footer.getByRole("navigation", {
    name: "Footer navigation",
  });

  for (const heading of ["Technology", "Solutions", "Company", "Resources"]) {
    await expect(
      footerNavigation.getByRole("heading", { name: heading }),
    ).toBeVisible();
  }

  await expect(
    footerNavigation.getByRole("link", { name: "Energy Optimization" }),
  ).toBeVisible();
  await expect(
    footerNavigation.getByRole("link", { name: "Multifamily Housing" }),
  ).toBeVisible();
  await expect(
    footerNavigation.getByRole("link", { name: "Contact & Support" }),
  ).toBeVisible();
  await expect(
    footerNavigation.getByRole("link", { name: "Savings Analysis" }),
  ).toBeVisible();
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

test("persists the selected color theme", async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.localStorage.getItem("theme")) {
      window.localStorage.setItem("theme", "light");
    }
  });
  await page.goto("/");

  const nightLayer = page.locator('[data-hero-layer="night"]');
  await expect(nightLayer).toHaveCSS("opacity", "0");

  const themeSwitch = page.getByRole("switch", {
    name: "Switch to night mode",
  });
  await expect(themeSwitch).toHaveAttribute("aria-checked", "false");
  await themeSwitch.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("switch", { name: "Switch to day mode" }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(nightLayer).toHaveCSS("opacity", "1");
  await expect(page.getByRole("banner")).not.toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await expect(page.locator("footer#company")).not.toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('[data-hero-layer="night"]')).toHaveCSS(
    "opacity",
    "1",
  );
});

test("validates and completes the frontend inquiry form", async ({ page }) => {
  await page.route("**/api/inquiries", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ ok: true }),
      contentType: "application/json",
      status: 201,
    });
  });
  await page.goto("/");

  const form = page.getByRole("form", { name: "Savings analysis inquiry" });
  await form.getByRole("button", { name: "Submit Inquiry" }).click();

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
  await form.getByRole("button", { name: "Submit Inquiry" }).click();

  await expect(
    form.getByText("Thanks. Your savings analysis request has been submitted."),
  ).toBeVisible();
});
