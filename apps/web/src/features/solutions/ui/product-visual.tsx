"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

type ProductVisualProps = {
  alt: string;
  hotspots: ReadonlyArray<{
    body: string;
    label: string;
    x: number;
    y: number;
  }>;
  image: StaticImageData;
};

export function ProductVisual({ alt, hotspots, image }: ProductVisualProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = hotspots[activeIndex];

  return (
    <div>
      <div className="border-border bg-surface-muted relative aspect-[6/5] overflow-hidden rounded-xl border">
        <Image
          alt={alt}
          className="object-contain p-8 sm:p-12"
          fill
          loading="eager"
          sizes="(max-width: 1023px) 92vw, 38vw"
          src={image}
        />
        {hotspots.map((hotspot, index) => (
          <button
            aria-label={`Show ${hotspot.label}`}
            aria-pressed={index === activeIndex}
            className="bg-brand-fill aria-pressed:ring-brand-soft aria-pressed:shadow-card absolute grid size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-white text-sm font-bold text-white shadow-lg transition-transform hover:scale-110 focus-visible:scale-110 aria-pressed:scale-[1.14] aria-pressed:ring-4"
            key={hotspot.label}
            onClick={() => setActiveIndex(index)}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div
        aria-live="polite"
        className="border-border bg-surface mt-3 min-h-24 rounded-lg border p-4"
      >
        <p className="text-foreground text-sm font-bold">{active.label}</p>
        <p className="text-muted mt-1 text-sm leading-6">{active.body}</p>
      </div>
    </div>
  );
}
