import { Droplets, Fan, Lightbulb, Thermometer } from "lucide-react";

import { products } from "@/features/home/model/home-content";
import { SectionHeading } from "@/shared/ui/section-heading";

const productIcons = [Thermometer, Lightbulb, Fan, Droplets] as const;

export function ProductSection() {
  return (
    <section
      aria-labelledby="products-heading"
      className="section-band bg-surface-muted"
    >
      <div className="section-shell">
        <SectionHeading
          description="One connected platform coordinates the systems that shape comfort, demand, and operating cost."
          eyebrow="More than HVAC"
          id="products-heading"
          title="Intelligent energy management for the whole building."
        />

        <div className="snap-row mt-10 md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
          {products.map((product, index) => {
            const Icon = productIcons[index];

            return (
              <article
                className="border-border bg-surface overflow-hidden rounded-lg border"
                key={product.title}
              >
                <div
                  aria-label={`${product.mediaLabel} placeholder`}
                  className="border-border bg-background grid aspect-[4/3] place-items-center border-b"
                  role="img"
                >
                  <div className="text-muted grid justify-items-center gap-3 px-4 text-center">
                    <Icon aria-hidden className="text-brand" size={52} />
                    <span className="text-xs font-semibold uppercase">
                      Product image placeholder
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-foreground text-lg font-semibold">
                    {product.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {product.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
