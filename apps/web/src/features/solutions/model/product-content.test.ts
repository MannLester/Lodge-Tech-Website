import { describe, expect, it } from "vitest";

import {
  getProduct,
  isProductSlug,
  productCtaHref,
  productSlugs,
  products,
  solutionSlugs,
  solutions,
} from "@/features/solutions/model/product-content";

describe("product content", () => {
  it("defines one complete entry for every public product route", () => {
    expect(products).toHaveLength(4);
    expect(products.map((product) => product.slug)).toEqual(productSlugs);
    expect(solutions.map((solution) => solution.slug)).toEqual(solutionSlugs);
    expect(solutions.map((solution) => solution.label)).toEqual([
      "GEM Link® Wireless – HVAC",
      "GEM Link® Wireless – Lighting Control",
      "GEM Link® – Appliance Control",
    ]);

    for (const slug of productSlugs) {
      const product = getProduct(slug);
      expect(product.features).toHaveLength(4);
      expect(product.showcases).toHaveLength(2);
      expect(product.specifications.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("rejects unknown routes and generates contextual CTA links", () => {
    expect(isProductSlug("gem-stat-et")).toBe(true);
    expect(isProductSlug("unknown")).toBe(false);
    expect(productCtaHref("gem-stat-et", "demo")).toBe(
      "/?product=gem-stat-et&intent=demo#contact",
    );
  });
});
