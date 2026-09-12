"use client";

import { useState } from "react";

import {
  products,
  type ProductSlug,
} from "@/features/solutions/model/product-content";
import { ButtonLink } from "@lodging-technologies/ui/button-link";

type EcosystemMapProps = {
  currentSlug: ProductSlug;
};

export function EcosystemMap({ currentSlug }: EcosystemMapProps) {
  const [selectedSlug, setSelectedSlug] = useState<ProductSlug>(currentSlug);
  const selected =
    products.find((product) => product.slug === selectedSlug) ?? products[0];

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
      <div className="border-border bg-surface-muted relative grid gap-3 rounded-xl border p-5 sm:grid-cols-2 sm:p-8">
        <span
          aria-hidden
          className="bg-brand-soft border-brand absolute inset-[20%] hidden rounded-full border border-dashed sm:block"
        />
        {products.map((product) => (
          <button
            aria-pressed={selectedSlug === product.slug}
            className={`relative min-h-24 cursor-pointer rounded-lg border p-4 text-left transition-colors ${selectedSlug === product.slug ? "border-brand bg-brand-soft text-brand-strong" : "border-border bg-surface text-foreground hover:border-brand"}`}
            key={product.slug}
            onClick={() => setSelectedSlug(product.slug)}
            type="button"
          >
            <span className="block text-sm font-bold">{product.label}</span>
            <span className="text-muted mt-1 block text-xs leading-5">
              {product.eyebrow}
            </span>
          </button>
        ))}
      </div>
      <div
        aria-live="polite"
        className="border-border bg-surface rounded-xl border p-6 sm:p-8"
      >
        <p className="eyebrow">Selected solution</p>
        <h3 className="text-foreground mt-3 text-2xl font-bold">
          {selected.label}
        </h3>
        <p className="text-muted mt-3 text-sm leading-6">
          {selected.shortDescription}
        </p>
        {selected.slug === currentSlug ? (
          <p className="text-brand-strong mt-5 text-sm font-semibold">
            You are viewing this solution.
          </p>
        ) : (
          <ButtonLink
            className="mt-5"
            href={`/solutions/${selected.slug}`}
            showArrow
            variant="outline"
          >
            Explore {selected.label}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
