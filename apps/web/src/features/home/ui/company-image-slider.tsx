"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import buildingImage from "@assets/lodge-tech-building.png";
import productGroupImage from "@assets/company/product-group-portrait.png";
import roomImage from "@assets/company/room.png";
import treeImage from "@assets/company/tree.png";

type Slide = {
  alt: string;
  label: string;
  position: string;
  source: StaticImageData;
};

const slides: readonly Slide[] = [
  {
    alt: "Lodging Technologies branded modern building exterior",
    label: "Building",
    position: "center",
    source: buildingImage,
  },
  {
    alt: "Lodging Technologies branded tree scene with two control devices",
    label: "Tree scene",
    position: "center 20%",
    source: treeImage,
  },
  {
    alt: "Lodging Technologies branded guest room with wall-mounted controls",
    label: "Guest room",
    position: "center 15%",
    source: roomImage,
  },
  {
    alt: "Lodging Technologies branded group of thermostat and control devices on green plinths",
    label: "Product group",
    position: "center",
    source: productGroupImage,
  },
];

const AUTOPLAY_INTERVAL_MS = 3000;

export function CompanyImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canAutoplay, setCanAutoplay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const updateAutoplay = () => {
      setCanAutoplay(!motionQuery?.matches && !document.hidden);
    };

    updateAutoplay();
    motionQuery?.addEventListener("change", updateAutoplay);
    document.addEventListener("visibilitychange", updateAutoplay);

    return () => {
      motionQuery?.removeEventListener("change", updateAutoplay);
      document.removeEventListener("visibilitychange", updateAutoplay);
    };
  }, []);

  useEffect(() => {
    if (!canAutoplay || isHovered || isFocused) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, canAutoplay, isHovered, isFocused]);

  function goTo(offset: number) {
    setActiveIndex(
      (current) => (current + offset + slides.length) % slides.length,
    );
  }

  return (
    <div
      aria-label="Company image gallery"
      className="mx-auto w-full max-w-md"
      data-active-slide={activeSlide.label}
      data-testid="company-gallery"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      }}
      onFocusCapture={() => setIsFocused(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="group"
    >
      <div className="border-border bg-brand-night relative aspect-[4/5] overflow-hidden rounded-lg border">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <Image
              alt={isActive ? slide.alt : ""}
              aria-hidden={isActive ? undefined : true}
              className={`object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${isActive ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
              data-company-slide={slide.label}
              data-active={isActive}
              fill
              key={slide.label}
              loading={index === 0 ? "eager" : "lazy"}
              placeholder="blur"
              sizes="(max-width: 1023px) min(92vw, 28rem), 38vw"
              src={slide.source}
              style={{ objectPosition: slide.position }}
            />
          );
        })}
        <span
          aria-live={isHovered || isFocused ? "polite" : "off"}
          className="sr-only"
        >
          {activeSlide.label}
        </span>
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pt-10 pb-3 sm:px-4 sm:pb-4">
          <button
            aria-label="Previous company image"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-white/50 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            onClick={() => goTo(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden size={20} />
          </button>
          <div
            aria-label="Choose company image"
            className="flex items-center gap-1"
            role="group"
          >
            {slides.map((slide, index) => (
              <button
                aria-label={`Show ${slide.label} image`}
                aria-pressed={index === activeIndex}
                className="grid size-9 cursor-pointer place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                key={slide.label}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`block rounded-full transition-all ${index === activeIndex ? "size-3 bg-white shadow-[0_0_0_3px_rgb(255_255_255_/_0.28)]" : "size-2.5 bg-white/65 hover:bg-white"}`}
                />
              </button>
            ))}
          </div>
          <button
            aria-label="Next company image"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-white/50 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            onClick={() => goTo(1)}
            type="button"
          >
            <ChevronRight aria-hidden size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
