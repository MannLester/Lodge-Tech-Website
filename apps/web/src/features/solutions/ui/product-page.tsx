import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  productCtaHref,
  products,
  type ProductPageContent,
} from "@/features/solutions/model/product-content";
import { EcosystemMap } from "@/features/solutions/ui/ecosystem-map";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";
import { ButtonLink } from "@lodging-technologies/ui/button-link";

type ProductPageProps = { product: ProductPageContent };

const technicalTopics = [
  {
    title: "Performance and electrical",
    body: "Discuss your equipment, operating requirements, and controllable loads with our team to assess a suitable configuration.",
  },
  {
    title: "Connectivity and installation",
    body: "Review supported equipment, installation conditions, and connectivity requirements for your property before selecting a system.",
  },
  {
    title: "Compliance and documentation",
    body: "Request the technical documentation and certification information applicable to the proposed equipment.",
  },
];

export function ProductPage({ product }: ProductPageProps) {
  const verifiedGroups = product.specifications
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !/pending|placeholder/i.test(item.value),
      ),
    }))
    .filter((group) => group.items.length > 0);
  const showcases = product.showcases.filter((showcase) => showcase.image);
  return (
    <div className="marketing-site" id="top">
      <SiteHeader fromHome={false} />
      <main>
        <div className="section-shell pt-6">
          <Link
            className="text-brand-strong inline-flex items-center gap-2 text-sm hover:underline"
            href="/#solutions"
          >
            <ArrowLeft aria-hidden size={16} />
            Back to Solutions
          </Link>
        </div>
        <nav
          aria-label="Product navigation"
          className="border-border bg-background mt-6 border-y"
        >
          <div className="section-shell flex flex-wrap gap-x-7 gap-y-2 py-4">
            {products.map((item) => (
              <Link
                aria-current={item.slug === product.slug ? "page" : undefined}
                className={`py-2 text-sm ${item.slug === product.slug ? "text-brand-strong font-semibold underline underline-offset-8" : "text-muted hover:text-brand-strong"}`}
                href={`/solutions/${item.slug}`}
                key={item.slug}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <section
          aria-labelledby="product-heading"
          className="editorial-section"
        >
          <div className="section-shell product-detail-hero">
            <div data-product-intro>
              <p className="chapter-label">{product.eyebrow}</p>
              <h1 className="mt-5 leading-tight" id="product-heading">
                {product.label}
              </h1>
              <p className="mt-5 text-xl leading-relaxed">{product.subtitle}</p>
              <p className="editorial-copy">{product.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
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
            <div className="order-first md:order-last" data-product-visual>
              <div className="product-detail-visual">
                <Image
                  alt={product.heroImageAlt.replace(
                    /product placeholder/i,
                    "illustration",
                  )}
                  className={
                    product.heroPhoto
                      ? "object-cover object-left"
                      : "object-contain p-6"
                  }
                  fill
                  preload
                  sizes="(max-width: 767px) 92vw, 48vw"
                  src={product.heroImage}
                />
                {!product.heroPhoto && (
                  <span className="photo-caption">
                    Illustrative solution overview
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
        <section
          aria-labelledby="features-heading"
          className="editorial-section product-section"
        >
          <div className="section-shell">
            <p className="chapter-label">Purpose in every detail</p>
            <h2 className="display-heading" id="features-heading">
              Designed for practical building operations.
            </h2>
            <div className="product-feature-list">
              {product.features.map((feature) => (
                <article key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
            {showcases.length > 0 && (
              <div className="mt-20 space-y-20">
                {showcases.map((showcase, index) => (
                  <article
                    className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
                    key={showcase.title}
                  >
                    <div
                      className={`order-last ${index % 2 ? "lg:order-2" : "lg:order-1"}`}
                      data-showcase-copy
                    >
                      <p className="chapter-label">In your space</p>
                      <h3 className="display-heading">{showcase.title}</h3>
                      <p className="editorial-copy">{showcase.body}</p>
                    </div>
                    <div
                      className={`relative order-first aspect-[4/3] overflow-hidden ${index % 2 ? "lg:order-1" : "lg:order-2"}`}
                      data-showcase-visual
                    >
                      <Image
                        alt={showcase.imageAlt ?? product.label}
                        className={`object-cover ${showcase.imagePosition ?? "object-center"}`}
                        fill
                        sizes="(max-width: 1023px) 92vw, 45vw"
                        src={showcase.image!}
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
        <section
          aria-labelledby="ecosystem-heading"
          className="editorial-section"
        >
          <div className="section-shell">
            <p className="chapter-label">Part of a connected property</p>
            <h2 className="display-heading" id="ecosystem-heading">
              See how the solutions work together.
            </h2>
            <p className="editorial-copy">
              Explore each solution’s role in your building.
            </p>
            <EcosystemMap currentSlug={product.slug} />
          </div>
        </section>
        <section
          aria-labelledby="specifications-heading"
          className="editorial-section assessment-section"
        >
          <div className="section-shell assessment-layout">
            <div>
              <p className="chapter-label">Before you specify</p>
              <h2 className="display-heading" id="specifications-heading">
                Details for technical evaluation.
              </h2>
              <p className="editorial-copy">
                The right fit depends on your building. Talk with our team about
                equipment compatibility, installation, and technical
                requirements.
              </p>
              <Link
                className="editorial-link"
                href={productCtaHref(product.slug, "demo")}
              >
                Discuss technical requirements <span aria-hidden>↗</span>
              </Link>
            </div>
            <div className="technical-details">
              {verifiedGroups.length > 0
                ? verifiedGroups.map((group, index) => (
                    <details key={group.title} open={index === 0}>
                      <summary>{group.title}</summary>
                      <dl>
                        {group.items.map((item) => (
                          <div className="mt-4" key={item.label}>
                            <dt>{item.label}</dt>
                            <dd>{item.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  ))
                : technicalTopics.map((topic, index) => (
                    <details key={topic.title} open={index === 0}>
                      <summary>{topic.title}</summary>
                      <p>{topic.body}</p>
                    </details>
                  ))}
            </div>
          </div>
        </section>
        <section
          aria-labelledby="bottom-cta-heading"
          className="editorial-section platform-section"
        >
          <div className="section-shell">
            <p className="chapter-label">Your property. Your next step.</p>
            <h2 className="display-heading" id="bottom-cta-heading">
              Let’s see where {product.label}
              <br />
              fits in your building.
            </h2>
            <p className="editorial-copy">
              Share your property details so we can discuss a suitable proposal
              or site survey.
            </p>
            <Link
              className="editorial-link"
              href={productCtaHref(product.slug, "savings")}
            >
              Get a Savings Analysis <span aria-hidden>↗</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
