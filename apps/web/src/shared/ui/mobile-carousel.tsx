"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type MobileCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  intervalMs?: number;
};

export function MobileCarousel({
  ariaLabel,
  children,
  className = "",
  intervalMs = 3000,
}: MobileCarouselProps) {
  const itemCount = Children.count(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);

  const scrollToItem = useCallback((index: number) => {
    const track = trackRef.current;
    const items = track?.children;
    const item = items?.item(index) as HTMLElement | null;
    const firstItem = items?.item(0) as HTMLElement | null;

    if (!track || !item || !firstItem) return;

    track.scrollTo({
      behavior: "smooth",
      left: item.offsetLeft - firstItem.offsetLeft,
    });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 47.999rem)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateAutoplay = () => {
      setAutoplayEnabled(mobileQuery.matches && !motionQuery.matches);
    };

    updateAutoplay();
    mobileQuery.addEventListener("change", updateAutoplay);
    motionQuery.addEventListener("change", updateAutoplay);

    return () => {
      mobileQuery.removeEventListener("change", updateAutoplay);
      motionQuery.removeEventListener("change", updateAutoplay);
    };
  }, []);

  useEffect(() => {
    if (!autoplayEnabled || interactionPaused || itemCount < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % itemCount;
        const track = trackRef.current;
        const items = track?.children;
        const item = items?.item(nextIndex) as HTMLElement | null;
        const firstItem = items?.item(0) as HTMLElement | null;

        if (track && item && firstItem) {
          track.scrollTo({
            behavior: "smooth",
            left: item.offsetLeft - firstItem.offsetLeft,
          });
        }

        return nextIndex;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [autoplayEnabled, interactionPaused, intervalMs, itemCount]);

  const syncActiveItem = () => {
    const track = trackRef.current;
    if (!track) return;

    const items = [...track.children] as HTMLElement[];
    const firstOffset = items[0]?.offsetLeft ?? 0;
    const nextIndex = items.reduce((closestIndex, item, index) => {
      const target = item.offsetLeft - firstOffset;
      const closestTarget =
        (items[closestIndex]?.offsetLeft ?? firstOffset) - firstOffset;

      return Math.abs(track.scrollLeft - target) <
        Math.abs(track.scrollLeft - closestTarget)
        ? index
        : closestIndex;
    }, 0);

    setActiveIndex(nextIndex);
  };

  return (
    <div
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className="min-w-0"
      role="region"
    >
      <div
        className={`snap-row ${className}`}
        onBlur={() => setInteractionPaused(false)}
        onFocus={() => setInteractionPaused(true)}
        onPointerCancel={() => setInteractionPaused(false)}
        onPointerDown={() => setInteractionPaused(true)}
        onPointerUp={() => setInteractionPaused(false)}
        onScroll={syncActiveItem}
        ref={trackRef}
      >
        {children}
      </div>

      {itemCount > 1 ? (
        <div className="mt-2 flex items-center justify-between md:hidden">
          <div aria-hidden className="flex items-center gap-1.5">
            {Array.from({ length: itemCount }, (_, index) => (
              <span
                className={`h-1.5 rounded-full transition-[width,background-color] ${index === activeIndex ? "bg-brand-primary w-6" : "bg-border w-1.5"}`}
                key={index}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              aria-label={`Previous item in ${ariaLabel}`}
              className="border-border bg-surface text-brand-strong hover:border-brand grid size-10 cursor-pointer place-items-center rounded-md border transition-colors"
              onClick={() =>
                scrollToItem((activeIndex - 1 + itemCount) % itemCount)
              }
              title="Previous item"
              type="button"
            >
              <ChevronLeft aria-hidden size={19} />
            </button>
            <button
              aria-label={`Next item in ${ariaLabel}`}
              className="border-border bg-surface text-brand-strong hover:border-brand grid size-10 cursor-pointer place-items-center rounded-md border transition-colors"
              onClick={() => scrollToItem((activeIndex + 1) % itemCount)}
              title="Next item"
              type="button"
            >
              <ChevronRight aria-hidden size={19} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
