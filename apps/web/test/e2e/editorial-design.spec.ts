import { expect, test } from "@playwright/test";

test("occupancy illustration responds to keyboard input without changing theme", async ({
  page,
}) => {
  await page.goto("/");
  const vacant = page.getByRole("button", { name: "Vacant", exact: true });
  await vacant.focus();
  await page.keyboard.press("Enter");
  await expect(vacant).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".occupancy-response")).toContainText(
    "Room empty.",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Occupied", exact: true }).click();
  await expect(page.locator(".occupancy-response")).toContainText(
    "Welcome in.",
  );
});

test("industry selection exposes one relevant description and contact route", async ({
  page,
}) => {
  await page.goto("/");
  const industries = page.locator("#industries");
  const selected = industries.getByRole("button", { name: /Student Housing/ });
  await selected.focus();
  await page.keyboard.press("Enter");
  await expect(selected).toHaveAttribute("aria-expanded", "true");
  await expect(industries.getByRole("img")).toHaveAttribute(
    "alt",
    "Student housing photography",
  );
  await expect(industries.getByRole("region")).toHaveCount(1);
  await industries.getByRole("link", { name: /Discuss your property/ }).click();
  await expect(page).toHaveURL(/#contact$/);
});

test("property photos crossfade on selection and settle without motion when requested", async ({
  page,
}) => {
  await page.goto("/");
  const industries = page.locator("#industries");
  const photos = industries.locator(".industry-photo-layer");
  await industries.scrollIntoViewIfNeeded();
  await photos.evaluateAll((images) =>
    Promise.all(images.map((image) => (image as HTMLImageElement).decode())),
  );
  await industries.getByRole("button", { name: /Student Housing/ }).click();
  await expect(photos.nth(3)).toHaveAttribute("data-active", "true");
  await expect(photos.nth(0)).toHaveAttribute("data-active", "false");
  await expect(photos.nth(3)).toHaveCSS("opacity", "1");
  await expect(industries.getByRole("img")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await industries.getByRole("button", { name: /Multifamily/ }).click();
  await expect(photos.nth(1)).toHaveAttribute("data-active", "true");
  const reducedTransition = await photos
    .nth(1)
    .evaluate((photo) =>
      Number.parseFloat(window.getComputedStyle(photo).transitionDuration),
    );
  expect(reducedTransition).toBeLessThan(0.001);
  await expect(industries.locator(".industry-caption-text")).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("platform inquiry carries product context into the existing form", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Request Platform Demo/ }).click();
  await expect(page.getByLabel("Project notes")).toHaveValue(
    "We would like to request a product demo for GEM Link Wireless.",
  );
});

test("editorial layouts fit both themes and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const mode of ["light", "dark"]) {
    if (mode === "dark")
      await page
        .getByRole("switch", { name: "Switch to night mode" })
        .filter({ visible: true })
        .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    for (const selector of [
      "#value",
      "#solutions",
      "#platform",
      "#industries",
      "#contact",
    ]) {
      expect(
        await page
          .locator(selector)
          .evaluate((element) => element.scrollWidth > element.clientWidth),
      ).toBe(false);
    }
  }
  await expect(page.locator("main")).not.toContainText(
    /pending verification|Verified result pending|evidence-safe language/,
  );
});
