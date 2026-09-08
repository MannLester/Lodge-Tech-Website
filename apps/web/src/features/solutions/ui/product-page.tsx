import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Check,
  FileCheck2,
  RadioTower,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  productCtaHref,
  products,
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
  { icon: RadioTower, label: "Connectivity", value: "Pending verification" },
  { icon: FileCheck2, label: "Technical data", value: "Pending verification" },
  {
    icon: BadgeCheck,
    label: "CE / UL / ENERGY STAR",
    value: "Statuses pending",
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

        <nav
          aria-label="Product navigation"
          className="border-border bg-background/95 sticky top-[4.25rem] z-40 mt-5 border-y py-3 backdrop-blur"
        >
          <div className="section-shell overflow-x-auto">
            <div className="grid min-w-[43rem] grid-cols-4 gap-3">
              {products.map((item) => {
                const active = item.slug === product.slug;
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full border px-4 py-3 text-center text-sm font-semibold transition-colors ${active ? "border-brand bg-brand-soft text-brand-strong" : "border-border bg-surface text-foreground hover:border-brand hover:text-brand-strong"}`}
                    href={`/solutions/${item.slug}`}
                    key={item.slug}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <section
          aria-labelledby="product-heading"
          className="section-band pt-10! sm:pt-14!"
        >
          <div className="section-shell border-border bg-surface shadow-soft grid gap-9 rounded-2xl border p-6 sm:p-9 lg:grid-cols-[1fr_0.88fr] lg:items-center lg:p-12">
            <div>
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
                <ButtonLink href={productCtaHref(product.slug, "demo")}>
                  Request a Demo
                </ButtonLink>
                <ButtonLink
                  href={productCtaHref(product.slug, "savings")}
                  variant="outline"
                >
                  Get a Savings Analysis
                </ButtonLink>
              </div>
            </div>
            <ProductVisual
              alt={product.heroImageAlt}
              hotspots={product.hotspots}
              image={product.heroImage}
            />
          </div>
        </section>

        <section
          aria-label="Quick specifications and certifications"
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
                  <div className={index % 2 ? "lg:order-2" : undefined}>
                    <p className="eyebrow">Feature showcase {index + 1}</p>
                    <h3 className="text-foreground mt-3 text-2xl font-bold sm:text-3xl">
                      {showcase.title}
                    </h3>
                    <p className="text-muted mt-4 text-base leading-7">
                      {showcase.body}
                    </p>
                  </div>
                  <div
                    className={`border-border bg-surface relative aspect-[16/10] overflow-hidden rounded-xl border ${index % 2 ? "lg:order-1" : ""}`}
                  >
                    <Image
                      alt={`${product.label} feature visual placeholder`}
                      className="object-contain p-10 opacity-75"
                      fill
                      sizes="(max-width: 1023px) 92vw, 42vw"
                      src={product.heroImage}
                    />
                    <span className="bg-surface/90 text-muted absolute right-3 bottom-3 rounded px-3 py-1.5 text-xs font-semibold">
                      Approved visual pending
                    </span>
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

        <section
          aria-labelledby="specifications-heading"
          className="section-band bg-surface-muted"
        >
          <div className="section-shell">
            <p className="eyebrow">Technical specifications</p>
            <h2
              className="text-foreground mt-3 text-3xl font-bold sm:text-4xl"
              id="specifications-heading"
            >
              Details for technical evaluation.
            </h2>
            <p className="text-muted mt-4 max-w-3xl leading-7">
              Development placeholders remain visible until manufacturer
              documentation and certification evidence are approved.
            </p>
            <div className="mt-8 space-y-3">
              {product.specifications.map((group, index) => (
                <details
                  className="border-border bg-surface group rounded-xl border"
                  key={group.title}
                  open={index === 0}
                >
                  <summary className="text-foreground cursor-pointer list-none px-5 py-5 font-bold marker:hidden sm:px-6">
                    {group.title}
                    <span
                      aria-hidden
                      className="text-brand float-right text-xl group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <dl className="border-border divide-border border-t px-5 py-2 sm:px-6">
                    {group.items.map((item) => (
                      <div
                        className="grid gap-1 border-b py-4 last:border-b-0 sm:grid-cols-[0.7fr_1fr]"
                        key={item.label}
                      >
                        <dt className="text-foreground text-sm font-semibold">
                          {item.label}
                        </dt>
                        <dd className="text-muted text-sm">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="proof-heading" className="section-band">
          <div className="section-shell shadow-soft overflow-hidden rounded-2xl bg-[#0b3148] text-white">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="bg-[#08283c] p-8 sm:p-10">
                <BarChart3 aria-hidden className="text-[#42c8f4]" size={38} />
                <p className="mt-6 text-xs font-bold tracking-widest text-[#8bdff8] uppercase">
                  ROI proof
                </p>
                <p className="mt-3 text-2xl font-bold">
                  Verified result pending
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Property, baseline, measurement period, and savings
                  methodology will be published after approval.
                </p>
              </div>
              <div className="p-8 sm:p-10 lg:p-12">
                <h2
                  className="text-3xl font-bold sm:text-4xl"
                  id="proof-heading"
                >
                  A case study built on evidence—not estimates.
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-white/75">
                  This section is reserved for a documented deployment with an
                  attributable customer, clear operating context, and verified
                  outcome. No unverified savings claim is presented.
                </p>
                <ButtonLink
                  className="mt-7 border-white! bg-white! text-[#075a7b]! hover:bg-[#e1f4fa]!"
                  href={productCtaHref(product.slug, "savings")}
                >
                  Discuss Your Property
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
              className="shrink-0 border-white! bg-white! text-[#075a7b]! hover:bg-[#e1f4fa]!"
              href={productCtaHref(product.slug, "savings")}
            >
              Get a Savings Analysis
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
