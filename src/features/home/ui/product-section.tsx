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
      className="section-band bg-background"
    >
      <div className="section-shell">
        <SectionHeading
          description="One platform. Many ways to save."
          eyebrow="More than HVAC"
          id="products-heading"
          title="Intelligent energy management for more than HVAC."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:items-start lg:gap-16">
          <div className="snap-row md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
            {products.map((product, index) => {
              const image = productImages[index];

              return (
                <article className="min-w-0 text-center" key={product.title}>
                  <MediaImage
                    alt={product.mediaLabel}
                    className="aspect-square rounded-md"
                    sizes="(max-width: 767px) 54vw, (max-width: 1023px) 36vw, 11vw"
                    src={image}
                  />
                  <div className="mx-auto mt-4 max-w-36">
                    <h3 className="text-foreground text-sm leading-tight font-semibold">
                      {product.title}
                    </h3>
                    <p className="text-muted mt-2 text-xs leading-5">
                      {product.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <aside
            aria-labelledby="platform-heading"
            className="lg:-mt-30"
            id="platform"
          >
            <MediaImage
              alt="Cloud dashboard and connected device imagery"
              className="mx-auto aspect-[16/10] max-w-[32rem] border-0 bg-transparent"
              imageClassName="object-contain object-center"
              sizes="(max-width: 1023px) 92vw, 39vw"
              src={platformImage}
            />
            <div className="mt-7 max-w-[33rem]">
              <p className="eyebrow">The platform</p>
              <h3
                className="text-foreground mt-3 text-2xl leading-tight font-semibold sm:text-3xl"
                id="platform-heading"
              >
                Building intelligence in the cloud.
              </h3>
              <p className="text-muted mt-4 text-sm leading-6 sm:text-base sm:leading-7">
                Monitor, analyze, and optimize properties from one connected
                view. The platform surfaces the information teams need to act
                quickly and operate intelligently.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
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
                className="!text-brand-strong hover:!text-brand mt-6 !min-h-0 !justify-start !px-0 !py-0"
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
