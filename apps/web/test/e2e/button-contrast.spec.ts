import { expect, test } from "@playwright/test";

test("solid blue controls use white text", async ({ page }) => {
  for (const path of ["/", "/solutions/gem-stat-et"]) {
    await page.goto(path);

    const colors = await page.locator("a, button").evaluateAll((controls) =>
      controls
        .filter((control) =>
          /(^|\s)bg-brand(?:-fill)?(\s|$)|bg-\[\#0096d7\]/.test(
            control.className,
          ),
        )
        .map((control) => ({
          color: window.getComputedStyle(control).color,
          text: control.textContent?.trim(),
        })),
    );

    expect(colors.length).toBeGreaterThan(0);
    expect(colors).toEqual(
      expect.arrayContaining(
        colors.map(() =>
          expect.objectContaining({ color: "rgb(255, 255, 255)" }),
        ),
      ),
    );
  }
});
