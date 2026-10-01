"use client";

import { useEffect, useRef, useState } from "react";

import { proofStats } from "@/features/home/model/home-content";

const durationMs = 1600;
const numberFormat = new Intl.NumberFormat("en-US");
function displayValue(
  stat: (typeof proofStats)[number],
  progress: number | null,
) {
  if (progress === null) return stat.value;

  const value = numberFormat.format(Math.round(stat.countTo * progress));
  return `${stat.prefix}${value}${stat.suffix}`;
}

export function ProofStats() {
  const stripRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !("IntersectionObserver" in window)) return;

    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (motionQuery?.matches) return;

    let frame = 0;
    let startedAt: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        observer.disconnect();
        setProgress(0);
        const tick = (now: number) => {
          startedAt ??= now;
          const elapsed = Math.min((now - startedAt) / durationMs, 1);
          setProgress(1 - (1 - elapsed) ** 3);
          if (elapsed < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.2 },
    );

    const finish = () => {
      if (!motionQuery?.matches) return;
      cancelAnimationFrame(frame);
      observer.disconnect();
      setProgress(null);
    };

    observer.observe(strip);
    motionQuery?.addEventListener("change", finish);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      motionQuery?.removeEventListener("change", finish);
    };
  }, []);

  return (
    <div
      className="hero-proof-strip border-border relative z-10 border-t"
      ref={stripRef}
    >
      <div
        aria-label="Experience and performance"
        className="section-shell grid py-7 md:grid-cols-3"
      >
        {proofStats.map((stat) => (
          <article className="proof-stat" key={stat.label}>
            <p className="proof-value">
              <span aria-hidden="true">{displayValue(stat, progress)}</span>
              <span className="sr-only">{stat.value}</span>
            </p>
            <p className="proof-label">{stat.label}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
