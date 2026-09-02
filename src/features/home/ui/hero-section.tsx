import {
  Activity,
  BadgeDollarSign,
  Building2,
  CalendarDays,
} from "lucide-react";

import { proofStats } from "@/features/home/model/home-content";
import { ButtonLink } from "@/shared/ui/button-link";

const statIcons = [CalendarDays, Building2, Activity, BadgeDollarSign] as const;

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-border bg-background border-b"
      id="technology"
    >
      <div className="section-shell grid gap-10 py-12 sm:py-16 lg:min-h-[36rem] lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-14">
        <div className="lg:col-span-5 lg:pr-4">
          <p className="eyebrow">Proven experience. Intelligent solutions.</p>
          <h1
            className="text-foreground mt-4 text-5xl leading-[1.04] font-semibold sm:text-6xl lg:text-7xl"
            id="hero-heading"
          >
            Energy wasted is money lost.
            <span className="text-brand-strong mt-2 block">
              We make buildings use less.
            </span>
          </h1>
          <p className="text-muted mt-6 max-w-xl text-base leading-7 sm:text-lg">
            Intelligent energy management that reduces HVAC runtime, lowers
            demand, and delivers real savings without compromising comfort.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="#contact">Get a Savings Analysis</ButtonLink>
            <ButtonLink href="#platform" variant="outline">
              Request a Demo
            </ButtonLink>
            <ButtonLink href="#contact" showArrow variant="text">
              Talk to an Expert
            </ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-4 lg:self-stretch">
          <div
            aria-label="Modern energy-efficient property image placeholder"
            className="border-border bg-surface-muted grid aspect-[4/5] min-h-80 place-items-center overflow-hidden rounded-lg border lg:absolute lg:inset-0"
            role="img"
          >
            <div className="text-muted grid justify-items-center gap-4 px-8 text-center">
              <Building2 aria-hidden className="text-brand" size={76} />
              <span className="max-w-48 text-xs font-semibold uppercase">
                Property hero image placeholder
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-3 lg:grid-cols-1">
          {proofStats.map((stat, index) => {
            const Icon = statIcons[index];

            return (
              <article
                className="border-border bg-surface shadow-card min-h-36 rounded-lg border p-4 sm:p-5 lg:min-h-0"
                key={stat.label}
              >
                <Icon aria-hidden className="text-brand" size={24} />
                <p className="text-foreground mt-3 text-2xl leading-none font-semibold">
                  {stat.value}
                </p>
                <p className="text-muted mt-2 text-xs leading-5 sm:text-sm">
                  {stat.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
