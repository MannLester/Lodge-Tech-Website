import { Building2, CalendarDays, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import heroHouseImage from "@assets/day_house.png";
import heroHouseNightImage from "@assets/day_night.png";
import { proofStats } from "@/features/home/model/home-content";
import { ButtonLink } from "@lodging-technologies/ui/button-link";

const statIcons = [CalendarDays, Building2, Gauge] as const;

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="hero relative isolate overflow-hidden border-b"
      id="technology"
    >
      <div className="absolute inset-0 z-0">
        <Image
          alt=""
          className="hero-day-image object-cover object-[58%_center]"
          data-hero-layer="day"
          fill
          placeholder="blur"
          preload
          quality={95}
          sizes="100vw"
          src={heroHouseImage}
        />
        <Image
          alt=""
          className="hero-night-image object-cover object-[58%_center]"
          data-hero-layer="night"
          fill
          placeholder="blur"
          quality={95}
          sizes="100vw"
          src={heroHouseNightImage}
        />
        <div className="hero-side-gradient absolute inset-0" />
        <div className="hero-bottom-gradient absolute inset-0" />
        <div className="hero-mobile-gradient absolute inset-0 lg:hidden" />
      </div>

      <div className="section-shell relative z-10 grid gap-10 py-16 sm:py-20 lg:min-h-[calc(100dvh-4.25rem)] lg:grid-cols-12 lg:items-center lg:py-16">
        <div className="max-w-xl lg:col-span-6 lg:-translate-x-10 lg:pr-4 xl:-translate-x-14">
          <p className="hero-eyebrow text-[0.6875rem] leading-tight font-bold tracking-[0.16em] uppercase">
            Whole-property energy intelligence
          </p>
          <div
            aria-label="Featured products"
            className="hero-product-links mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold"
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
            className="hero-heading mt-6 text-4xl leading-[1.04] font-semibold tracking-tight sm:text-5xl xl:text-6xl"
            id="hero-heading"
          >
            Save energy without sacrificing{" "}
            <span className="hero-heading-accent">comfort.</span>
          </h1>
          <p className="hero-copy mt-7 max-w-md text-base leading-7 sm:text-lg sm:leading-8">
            Smart controls reduce unnecessary HVAC, lighting, and appliance use
            while helping properties maintain occupant comfort.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-5 sm:items-start">
            <ButtonLink
              className="px-6 !text-white"
              href="/request-for-proposal"
              showArrow
            >
              Request for Proposal / Site Survey
            </ButtonLink>
            <a
              className="hero-secondary-link py-2 text-center text-sm font-semibold underline underline-offset-4 sm:text-left"
              href="#solutions"
            >
              Explore our solutions
            </a>
          </div>
        </div>
      </div>

      <div className="hero-proof-panel relative z-10 border-t">
        <div
          aria-label="Experience and performance"
          className="section-shell grid gap-6 py-7 sm:grid-cols-3"
        >
          {proofStats.map((stat, index) => {
            const Icon = statIcons[index];
            return (
              <article className="flex items-center gap-4" key={stat.label}>
                <span className="hero-stat-icon grid size-11 shrink-0 place-items-center rounded-full text-white">
                  <Icon aria-hidden size={21} />
                </span>
                <div>
                  <p className="hero-stat-value text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="hero-stat-label mt-1 max-w-60 text-xs leading-5">
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
