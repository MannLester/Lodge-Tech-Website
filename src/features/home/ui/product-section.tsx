import { Check } from "lucide-react";

import auxiliaryImage from "../../../../assets/auxiliary.png";
import exhaustImage from "../../../../assets/exhaust.png";
import hvacImage from "../../../../assets/hvac.png";
import lightingImage from "../../../../assets/lighting.png";
import platformImage from "../../../../assets/platform.png";
import { products } from "@/features/home/model/home-content";
import { ButtonLink } from "@/shared/ui/button-link";
import { MediaImage } from "@/shared/ui/media-image";
import { SectionHeading } from "@/shared/ui/section-heading";

const productImages = [hvacImage, lightingImage, exhaustImage, auxiliaryImage];

const platformCapabilities = [
  "Real-time portfolio visibility",
  "Advanced analytics and alarms",
  "Diagnostics and benchmarking",
  "Predictive operating insights",
] as const;

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

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="snap-row md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:overflow-visible lg:col-span-7">
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
                    sizes="(max-width: 767px) 82vw, (max-width: 1023px) 45vw, 30vw"
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

          <aside
            aria-labelledby="platform-heading"
            className="border-border bg-surface shadow-soft overflow-hidden rounded-lg border lg:col-span-5"
            id="platform"
          >
            <MediaImage
              alt="Cloud dashboard and connected device imagery"
              className="aspect-[16/10] rounded-none border-x-0 border-t-0"
              imageClassName="object-cover object-left"
              sizes="(max-width: 1023px) 100vw, 42vw"
              src={platformImage}
            />
            <div className="p-6">
              <p className="eyebrow">The platform</p>
              <h3
                className="text-foreground mt-3 text-2xl leading-tight font-semibold"
                id="platform-heading"
              >
                Building intelligence in the cloud.
              </h3>
              <p className="text-muted mt-4 text-sm leading-6">
                Monitor, analyze, and optimize properties from one connected
                view. The platform surfaces the information teams need to act
                quickly and operate intelligently.
              </p>
              <ul className="mt-5 grid gap-3">
                {platformCapabilities.map((capability) => (
                  <li
                    className="flex items-center gap-3 text-sm"
                    key={capability}
                  >
                    <span className="bg-brand-soft text-brand-strong grid size-6 shrink-0 place-items-center rounded-full">
                      <Check aria-hidden size={15} strokeWidth={2.5} />
                    </span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink
                className="mt-6"
                href="#contact"
                showArrow
                variant="text"
              >
                Explore the Platform
              </ButtonLink>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
