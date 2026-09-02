import auxiliaryImage from "../../../../assets/auxiliary.png";
import exhaustImage from "../../../../assets/exhaust.png";
import hvacImage from "../../../../assets/hvac.png";
import lightingImage from "../../../../assets/lighting.png";
import { products } from "@/features/home/model/home-content";
import { MediaImage } from "@/shared/ui/media-image";
import { SectionHeading } from "@/shared/ui/section-heading";

const productImages = [hvacImage, lightingImage, exhaustImage, auxiliaryImage];

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
            const image = productImages[index];

            return (
              <article
                className="border-border bg-surface overflow-hidden rounded-lg border"
                key={product.title}
              >
                <MediaImage
                  alt={product.mediaLabel}
                  className="aspect-[4/3] rounded-none border-x-0 border-t-0"
                  sizes="(max-width: 767px) 82vw, (max-width: 1023px) 45vw, 25vw"
                  src={image}
                />
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
