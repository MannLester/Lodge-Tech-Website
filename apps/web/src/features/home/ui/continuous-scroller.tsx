"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type ContinuousScrollerProps = {
  children: ReactNode;
  className?: string;
};

export function ContinuousScroller({
  children,
  className = "",
}: ContinuousScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const mobileQuery = window.matchMedia("(max-width: 47.999rem)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let animationFrame = 0;
    let previousTime = performance.now();

    const scroll = (time: number) => {
      const elapsed = time - previousTime;
      previousTime = time;

      if (mobileQuery.matches && !reducedMotionQuery.matches) {
        const firstGroup = scroller.querySelector<HTMLElement>(
          ".continuous-scroller-group",
        );
        const loopWidth = firstGroup?.offsetWidth ?? 0;

        if (loopWidth > 0) {
          scroller.scrollLeft += (18 * elapsed) / 1000;
          if (scroller.scrollLeft >= loopWidth) {
            scroller.scrollLeft -= loopWidth;
          }
        }
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={`continuous-scroller ${className}`} ref={scrollerRef}>
      <div className="continuous-scroller-track">
        <div className="continuous-scroller-group">{children}</div>
        <div aria-hidden="true" className="continuous-scroller-group" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
