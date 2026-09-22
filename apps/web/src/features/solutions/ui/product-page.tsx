import {
  ArrowLeft,
  Building2,
  Check,
  ClipboardCheck,
  MessageSquareText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  productCtaHref,
  type ProductPageContent,
} from "@/features/solutions/model/product-content";
import { EcosystemMap } from "@/features/solutions/ui/ecosystem-map";
import { ProductVisual } from "@/features/solutions/ui/product-visual";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";
import { ButtonLink } from "@lodging-technologies/ui/button-link";

type ProductPageProps = {
  product: ProductPageContent;
};

const trustItems = [
  {
    icon: Building2,
    label: "Property review",
    value: "Start with your building and operating needs",
  },
  {
    icon: ClipboardCheck,
    label: "Solution fit",
    value: "Match controls to suitable spaces and loads",
  },
  {
    icon: MessageSquareText,
    label: "Project path",
    value: "Continue with a proposal or site survey",
  },
] as const;

export function ProductPage({ product }: ProductPageProps) {
  return (
    <div id="top">
      <SiteHeader fromHome={false} />
      <main>
        <div className="section-shell pt-6">
          <Link
            className="text-brand-strong inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            href="/#solutions"
          >
            <ArrowLeft aria-hidden size={16} />
            Back to Solutions
          </Link>
        </div>

        <section
          aria-labelledby="product-heading"
          className="section-band pt-10! sm:pt-14!"
        >
          <div className="section-shell border-border bg-surface shadow-soft grid gap-9 rounded-2xl border p-6 sm:p-9 lg:grid-cols-[1fr_0.88fr] lg:items-center lg:p-12">
            <div data-product-intro>
              <p className="eyebrow">{product.eyebrow}</p>
              <h1
                className="text-foreground mt-4 text-4xl leading-tight font-bold sm:text-5xl"
                id="product-heading"
              >
                {product.label}
              </h1>
              <p className="text-brand-strong mt-3 text-lg font-semibold sm:text-xl">
                {product.subtitle}
              </p>
              <p className="text-muted mt-5 max-w-2xl text-base leading-7">
                {product.description}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={productCtaHref(product.slug, "savings")}>
                  Request for Proposal / Site Survey
                </ButtonLink>
                <ButtonLink
                  href={productCtaHref(product.slug, "demo")}
                  variant="outline"
                >
                  Request a Product Demo
                </ButtonLink>
              </div>
            </div>
            <div className="order-first lg:order-last" data-product-visual>
              <ProductVisual
                alt={product.heroImageAlt}
                image={product.heroImage}
                photo={product.heroPhoto}
              />
            </div>
          </div>
        </section>

        <section
          aria-label="Project evaluation process"
          className="pb-16 sm:pb-20"
        >
          <div className="section-shell border-border bg-surface-muted grid overflow-hidden rounded-xl border md:grid-cols-3">
            {trustItems.map(({ icon: Icon, label, value }) => (
              <div
                className="border-border flex items-center gap-4 border-b p-5 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
                key={label}
              >
                <span className="bg-brand-soft text-brand-strong grid size-10 shrink-0 place-items-center rounded-full">
                  <Icon aria-hidden size={20} />
                </span>
                <div>
                  <p className="text-foreground text-sm font-bold">{label}</p>
                  <p className="text-muted mt-1 text-xs">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="features-heading"
          className="section-band bg-surface-muted"
        >
          <div className="section-shell">
            <p className="eyebrow">Key features</p>
            <h2
              className="text-foreground mt-3 text-3xl font-bold sm:text-4xl"
              id="features-heading"
            >
              Designed for practical building operations.
            </h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {product.features.map((feature) => (
                <article
                  className="border-border bg-surface rounded-xl border p-6"
                  key={feature.title}
                >
                  <span className="bg-brand-soft text-brand-strong grid size-9 place-items-center rounded-full">
                    <Check aria-hidden size={18} strokeWidth={2.5} />
                  </span>
                  <h3 className="text-foreground mt-5 font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-16 space-y-14">
              {product.showcases.map((showcase, index) => (
                <article
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
                  key={showcase.title}
                >
                  <div
                    className={`order-last ${index % 2 ? "lg:order-2" : "lg:order-1"}`}
                    data-showcase-copy
                  >
                    <p className="eyebrow">Feature showcase {index + 1}</p>
                    <h3 className="text-foreground mt-3 text-2xl font-bold sm:text-3xl">
                      {showcase.title}
                    </h3>
                    <p className="text-muted mt-4 text-base leading-7">
                      {showcase.body}
                    </p>
                  </div>
                  <div
                    className={`border-border bg-surface relative order-first aspect-[16/10] overflow-hidden rounded-xl border ${index % 2 ? "lg:order-1" : "lg:order-2"}`}
                    data-showcase-visual
                  >
                    <Image
                      alt={
                        showcase.imageAlt ?? `${product.label} solution visual`
                      }
                      className={
                        showcase.image
                          ? `object-cover ${showcase.imagePosition ?? "object-center"}`
                          : "object-contain p-10 opacity-75"
                      }
                      fill
                      sizes="(max-width: 1023px) 92vw, 42vw"
                      src={showcase.image ?? product.heroImage}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="ecosystem-heading" className="section-band">
          <div className="section-shell">
            <p className="eyebrow">Connected ecosystem</p>
            <h2
              className="text-foreground mt-3 text-3xl font-bold sm:text-4xl"
              id="ecosystem-heading"
            >
              See how the solutions work together.
            </h2>
            <p className="text-muted mt-4 max-w-3xl leading-7">
              Select a solution to understand its role, then move directly to
              its dedicated page.
            </p>
            <EcosystemMap currentSlug={product.slug} />
          </div>
        </section>

        <section aria-labelledby="proof-heading" className="section-band">
          <div className="section-shell bg-brand-night shadow-soft overflow-hidden rounded-2xl text-white">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="bg-brand-deep p-8 sm:p-10">
                <ClipboardCheck
                  aria-hidden
                  className="text-brand-white"
                  size={38}
                />
                <p className="text-brand-white mt-6 text-xs font-bold tracking-widest uppercase">
                  Property-specific planning
                </p>
                <p className="mt-3 text-2xl font-bold">Start with real needs</p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Review the building, operating patterns, and controllable
                  loads before selecting a project path.
                </p>
              </div>
              <div className="p-8 sm:p-10 lg:p-12">
                <h2
                  className="text-3xl font-bold sm:text-4xl"
                  id="proof-heading"
                >
                  Plan around your property—not generic estimates.
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-white/75">
                  Tell us where energy is being used and what your team needs to
                  protect. We’ll help identify a practical next step without
                  relying on unsupported performance claims.
                </p>
                <ButtonLink
                  className="text-brand-strong! hover:bg-brand-soft! mt-7 border-white! bg-white!"
                  href={productCtaHref(product.slug, "savings")}
                >
                  Request for Proposal / Site Survey
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="bottom-cta-heading"
          className="pb-16 sm:pb-20 lg:pb-24"
        >
          <div className="section-shell bg-brand-fill shadow-card flex flex-col gap-6 rounded-2xl px-7 py-9 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2
                className="text-2xl font-bold sm:text-3xl"
                id="bottom-cta-heading"
              >
                Ready to evaluate {product.label}?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Tell us about your building and we’ll help identify the right
                next step.
              </p>
            </div>
            <ButtonLink
              className="text-brand-strong! hover:bg-brand-soft! shrink-0 border-white! bg-white!"
              href={productCtaHref(product.slug, "savings")}
            >
              Request for Proposal / Site Survey
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
