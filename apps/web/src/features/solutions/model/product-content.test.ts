import { describe, expect, it } from "vitest";

import {
  getProduct,
  isProductSlug,
  productCtaHref,
  productSlugs,
  products,
} from "@/features/solutions/model/product-content";

describe("product content", () => {
  it("defines one complete entry for every public product route", () => {
    expect(products).toHaveLength(4);
    expect(products.map((product) => product.slug)).toEqual(productSlugs);

    for (const slug of productSlugs) {
      const product = getProduct(slug);
      expect(product.features).toHaveLength(4);
      expect(product.hotspots.length).toBeGreaterThanOrEqual(3);
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
