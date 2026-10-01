import { expect, test } from "@playwright/test";

test("solid blue controls have readable text contrast", async ({ page }) => {
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
          background: window.getComputedStyle(control).backgroundColor,
          color: window.getComputedStyle(control).color,
          text: control.textContent?.trim(),
        })),
    );

    expect(colors.length).toBeGreaterThan(0);
    function luminance(color: string) {
      const channels = color
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number)
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }
    for (const control of colors) {
      const foreground = luminance(control.color);
      const background = luminance(control.background);
      const ratio =
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05);
      expect(ratio, control.text ?? "Blue control").toBeGreaterThanOrEqual(4.5);
    }
  }
});
