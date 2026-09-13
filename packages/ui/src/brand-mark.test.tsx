import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandMark } from "./brand-mark";

describe("BrandMark", () => {
  it("renders responsive approved marks by default", () => {
    const { container } = render(<BrandMark />);
    const logos = container.querySelectorAll("img");

    expect(
      screen.getByRole("link", { name: "Lodging Technologies home" }),
    ).toHaveAttribute("href", "#top");
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveAttribute(
      "src",
      "/brand/lodging-technologies-logo-deep-blue.svg",
    );
    expect(logos[1]).toHaveAttribute(
      "src",
      "/brand/lodging-technologies-logo-white.svg",
    );
  });

  it.each(["deep", "primary", "white"] as const)(
    "renders the explicit %s logo tone",
    (tone) => {
      const { container } = render(<BrandMark tone={tone} />);
      const logos = container.querySelectorAll("img");

      expect(logos).toHaveLength(1);
      expect(logos[0]).toHaveAttribute(
        "src",
        `/brand/lodging-technologies-logo-${tone === "deep" ? "deep-blue" : tone}.svg`,
      );
    },
  );
});
