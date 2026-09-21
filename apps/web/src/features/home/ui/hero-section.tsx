import { Building2, CalendarDays, Gauge } from "lucide-react";
import Link from "next/link";

import { proofStats } from "@/features/home/model/home-content";
import { HeroRoom } from "@/features/home/ui/hero-room";
import { ButtonLink } from "@lodging-technologies/ui/button-link";

const statIcons = [CalendarDays, Building2, Gauge] as const;

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-border bg-surface-muted border-b"
      id="technology"
    >
      <div className="section-shell grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div className="max-w-xl">
          <p className="eyebrow">Guest comfort. Less energy waste.</p>
          <div
            aria-label="Featured products"
            className="text-brand-strong mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold"
          >
            <Link
              className="underline-offset-4 hover:underline"
              href="/solutions/gem-link-wireless"
            >
              GEM Link® Wireless
            </Link>
            <Link
              className="underline-offset-4 hover:underline"
              href="/solutions/gem-stat-et"
            >
              GEM Stat™ ET
            </Link>
          </div>
          <h1
            className="text-foreground mt-6 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl xl:text-6xl"
            id="hero-heading"
          >
            Save energy without sacrificing{" "}
            <span className="text-brand-strong">comfort.</span>
          </h1>
          <p className="text-muted mt-6 max-w-md text-base leading-7 sm:text-lg sm:leading-8">
            Smart controls adjust heating and cooling when rooms are empty. Cut
            energy waste. Keep guests comfortable.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-5 sm:items-start">
            <ButtonLink className="px-6 !text-white" href="#contact" showArrow>
              Request a Proposal / Site Survey
            </ButtonLink>
            <a
              className="text-brand-strong py-2 text-center text-sm font-semibold underline underline-offset-4 sm:text-left"
              href="#solutions"
            >
              Explore our solutions
            </a>
          </div>
        </div>
        <HeroRoom />
      </div>
      <div className="border-border bg-surface border-t">
        <div
          aria-label="Experience and performance"
          className="section-shell grid gap-6 py-7 sm:grid-cols-3"
        >
          {proofStats.map((stat, index) => {
            const Icon = statIcons[index];
            return (
              <article className="flex items-center gap-4" key={stat.label}>
                <span className="bg-brand-soft text-brand-strong grid size-11 shrink-0 place-items-center rounded-full">
                  <Icon aria-hidden size={21} />
                </span>
                <div>
                  <p className="text-foreground text-2xl font-semibold">
                    {stat.value}
                  </p>
                  <p className="text-muted mt-1 max-w-60 text-xs leading-5">
                    {stat.label}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
