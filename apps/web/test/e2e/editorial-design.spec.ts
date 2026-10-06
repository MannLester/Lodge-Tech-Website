import { expect, test } from "@playwright/test";

test("occupancy illustration responds to keyboard input without changing theme", async ({
  page,
}) => {
  await page.goto("/");
  const photo = page.locator(".occupancy-photo");
  const occupiedImage = photo.locator('img[data-state="occupied"]');
  const vacantImage = photo.locator('img[data-state="vacant"]');
  await expect(occupiedImage).toHaveCSS("opacity", "1");
  await expect(vacantImage).toHaveCSS("opacity", "0");
  const vacant = page.getByRole("button", { name: "Vacant", exact: true });
  await vacant.focus();
  await page.keyboard.press("Enter");
  await expect(vacant).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".occupancy-response")).toContainText(
    "Room empty.",
  );
  await expect(photo).toHaveAttribute("data-occupied", "false");
  await expect(vacantImage).toHaveCSS("opacity", "1");
  await expect(occupiedImage).toHaveCSS("opacity", "0");
  await expect(vacantImage).toHaveAttribute(
    "alt",
    "Illustrative thermostat in a vacant guest room",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Occupied", exact: true }).click();
  await expect(page.locator(".occupancy-response")).toContainText(
    "Welcome in.",
  );
  await expect(occupiedImage).toHaveCSS("opacity", "1");
});

test("industry selection exposes one relevant description and contact route", async ({
  page,
}) => {
  await page.goto("/");
  const industries = page.locator("#industries");
  await expect(
    industries.getByRole("img", {
      name: "Hotel entrance with a covered drive-under portico",
    }),
  ).toBeVisible();
  const selected = industries.getByRole("button", { name: /Student Housing/ });
  await selected.focus();
  await page.keyboard.press("Enter");
  await expect(selected).toHaveAttribute("aria-expanded", "true");
  await expect(industries.getByRole("img")).toHaveAttribute(
    "alt",
    "Student housing photography",
  );
  await expect(industries.getByRole("region")).toHaveCount(1);
  if (page.viewportSize()!.width < 768) {
    await expect(industries.locator(".industry-photo")).toBeHidden();
    await expect(
      industries.getByRole("region").getByRole("img"),
    ).toHaveAttribute("alt", "Student housing photography");

    const commercial = industries.getByRole("button", {
      name: /Commercial & Office/,
    });
    await commercial.click();
    const commercialPanel = industries.getByRole("region");
    await expect(commercial).toHaveAttribute("aria-expanded", "true");
    await expect(commercialPanel.getByRole("img")).toHaveAttribute(
      "alt",
      "Commercial office photography",
    );
    expect(
      (await commercialPanel.getByRole("img").boundingBox())!.y,
    ).toBeGreaterThan((await commercial.boundingBox())!.y);
  }
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
  if (page.viewportSize()!.width >= 768) {
    await photos.evaluateAll((images) =>
      Promise.all(images.map((image) => (image as HTMLImageElement).decode())),
    );
  }
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

test("process timeline lights each step leading to the hovered or focused step", async ({
  page,
}) => {
  await page.goto("/");
  const steps = page.locator(".process-timeline li");
  const dotColor = (index: number) =>
    steps
      .nth(index)
      .evaluate((step) => getComputedStyle(step, "::before").backgroundColor);
  const initialDot = await dotColor(2);
  const lineProperty = (await page.evaluate(
    () => matchMedia("(max-width: 47.99rem)").matches,
  ))
    ? "border-left-color"
    : "border-top-color";
  const initialLine = await steps
    .nth(0)
    .evaluate(
      (step, property) => getComputedStyle(step).getPropertyValue(property),
      lineProperty,
    );

  await steps.nth(2).hover();
  const activeDot = "rgb(76, 145, 125)";
  await expect.poll(() => dotColor(2)).toBe(activeDot);
  await expect.poll(() => dotColor(0)).toBe(activeDot);
  await expect.poll(() => dotColor(1)).toBe(activeDot);
  expect(await dotColor(3)).toBe(initialDot);
  await expect(steps.nth(0)).not.toHaveCSS(lineProperty, initialLine);
  await expect(steps.nth(2)).toHaveCSS(lineProperty, initialLine);

  await page.mouse.move(0, 0);
  await steps.nth(0).focus();
  await page.keyboard.press("Tab");
  await expect(steps.nth(1)).toBeFocused();
  await expect.poll(() => dotColor(0)).toBe(activeDot);
  await expect.poll(() => dotColor(2)).toBe(initialDot);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedTransition = await steps
    .nth(1)
    .evaluate((step) =>
      Number.parseFloat(getComputedStyle(step, "::before").transitionDuration),
    );
  expect(reducedTransition).toBeLessThan(0.001);
});

test("platform inquiry carries product context into the existing form", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Request Platform Demo/ }).click();
  await expect(page.getByLabel("Project notes")).toHaveValue(
    "We would like to request a product demo for GEM Link® Wireless – HVAC.",
  );
});

test("GEM Link® Wireless pairs connected control with Beyond HVAC products", async ({
  page,
}) => {
  await page.goto("/#solutions");
  const gemLink = page.locator(".product-showcase");
  const connected = gemLink.locator(".connected-property-panel");
  const visual = connected.locator(".wireless-platform-connection");
  const stage = visual.locator(".wireless-platform-stage");
  const beyondHvac = gemLink.locator(".beyond-hvac-panel");
  const lightWordmark = connected.locator(".wireless-platform-logo-light");
  const darkWordmark = connected.locator(".wireless-platform-logo-dark");

  await expect(visual.getByRole("img")).toHaveCount(1);
  await expect(lightWordmark).toHaveAttribute("alt", "");
  await expect(darkWordmark).toHaveAttribute("alt", "");
  await expect(lightWordmark).toBeVisible();
  await expect(darkWordmark).toBeHidden();
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "dark"),
  );
  await expect(lightWordmark).toBeHidden();
  await expect(darkWordmark).toBeVisible();
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "light"),
  );
  await expect(visual).toContainText(
    "GEM Link® Wireless brings supported room controls and building loads into a coordinated operating view.",
  );
  const stageWidth = (await stage.boundingBox())!.width;
  const imageWidth = (await visual
    .locator(".wireless-platform-image")
    .boundingBox())!.width;
  expect(stageWidth).toBeLessThanOrEqual((await visual.boundingBox())!.width);
  expect(imageWidth).toBeGreaterThanOrEqual(240);
  await expect(visual.locator(".connection-loads span")).toHaveText([
    "HVAC",
    "Lighting",
  ]);
  await expect(
    beyondHvac.getByRole("heading", { name: "Beyond HVAC" }),
  ).toBeVisible();
  await expect(beyondHvac.locator(".supporting-product")).toHaveCount(1);
  await expect(beyondHvac).not.toContainText("Appliance");
  if (page.viewportSize()!.width >= 1024) {
    expect((await beyondHvac.boundingBox())!.height).toBeLessThan(
      (await connected.boundingBox())!.height,
    );
  }
  await expect(beyondHvac.locator(".supporting-product-image img")).toHaveCount(
    1,
  );
  const thumbnailWidths = await beyondHvac
    .locator(".supporting-product-image")
    .evaluateAll((thumbnails) =>
      thumbnails.map((thumbnail) => thumbnail.getBoundingClientRect().width),
    );
  const maximumThumbnailWidth = page.viewportSize()!.width >= 768 ? 120 : 92;
  for (const width of thumbnailWidths) {
    expect(width).toBeLessThanOrEqual(maximumThumbnailWidth);
  }
  await expect(
    connected.getByRole("link", {
      name: "Learn more about GEM Link® Wireless HVAC",
    }),
  ).toHaveAttribute("href", "/solutions/gem-link-wireless");
  expect(
    await stage.evaluate(
      (element) => getComputedStyle(element, "::before").animationName,
    ),
  ).toBe("connection-ring-pulse");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await stage.evaluate(
      (element) => getComputedStyle(element, "::before").animationName,
    ),
  ).toBe("none");
  expect(
    await gemLink.evaluate(
      (section) => section.scrollWidth > section.clientWidth,
    ),
  ).toBe(false);
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
