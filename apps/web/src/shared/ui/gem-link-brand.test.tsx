import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GemLinkBrand } from "@/shared/ui/gem-link-brand";

describe("GemLinkBrand", () => {
  it("uses the supplied artwork with an accessible brand name and visible trademark", () => {
    render(<GemLinkBrand label="GEM Link Wireless – Lighting Control" />);

    const brand = screen.getByRole("img", {
      name: "GEM Link Wireless™ – Lighting Control",
    });
    expect(brand).toHaveTextContent("™");
    expect(brand).toHaveTextContent("– Lighting Control");
    expect(brand.querySelectorAll("img")).toHaveLength(2);
  });

  it("keeps the stacked layout class for narrow product cards", () => {
    render(<GemLinkBrand label="GEM Link Wireless – DHW Controls" stacked />);

    expect(
      screen.getByRole("img", { name: "GEM Link Wireless™ – DHW Controls" }),
    ).toHaveClass("gem-link-brand--stacked");
  });
});
