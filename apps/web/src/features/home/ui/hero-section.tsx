import {
  Activity,
  BadgeDollarSign,
  Building2,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";

import heroHouseImage from "@assets/day_house.png";
import heroHouseNightImage from "@assets/day_night.png";
import {
  proofStats,
  proofTickerItems,
} from "@/features/home/model/home-content";
import { ButtonLink } from "@lodging-technologies/ui/button-link";

const statIcons = [CalendarDays, Building2, Activity, BadgeDollarSign] as const;

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

      <div className="section-shell relative z-10 grid gap-10 py-16 sm:py-20 lg:min-h-[calc(100dvh-4.25rem)] lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-16">
        <div className="max-w-2xl lg:col-span-6 lg:-translate-x-10 lg:pr-4 xl:-translate-x-14">
          <p className="hero-eyebrow flex items-center gap-3 text-[0.6875rem] leading-tight font-bold tracking-[0.18em] uppercase">
            <span className="hero-eyebrow-line h-0.5 w-6" aria-hidden />
            Since 1980. Proven experience. Intelligent solutions.
          </p>
          <h1
            aria-label="Reduce HVAC, Lighting, and Appliance Energy Expense 40% with GEM Link Wireless and GEM Stat ET."
            className="hero-heading mt-6 text-4xl leading-[1.04] font-semibold sm:text-5xl"
            id="hero-heading"
          >
            Reduce HVAC, Lighting, and Appliance Energy Expense{" "}
            <span className="hero-heading-accent">40%</span>
            <span className="mt-3 block text-2xl leading-tight sm:text-3xl">
              with GEM Link Wireless and GEM Stat ET.
            </span>
          </h1>
          <p className="hero-copy mt-7 max-w-[22rem] text-sm leading-6 sm:max-w-[31rem] sm:text-base sm:leading-7">
            Intelligent energy management for lodging, multifamily, senior
            living, student housing, and commercial properties, built to lower
            expense without compromising comfort.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink className="px-6 !text-white" href="#contact">
              Get a Savings Analysis
            </ButtonLink>
            <ButtonLink
              className="hero-secondary-cta !bg-transparent px-6"
              href="#platform"
              variant="outline"
            >
              Request a Demo
            </ButtonLink>
          </div>
        </div>

        <div className="hero-proof-panel rounded-lg border p-5 backdrop-blur-md sm:p-6 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
          {proofStats.map((stat, index) => {
            const Icon = statIcons[index];

            return (
              <article
                className="grid grid-cols-[3rem_1fr] items-center gap-x-4 py-4 first:pt-0 last:pb-0"
                key={stat.label}
              >
                <span className="hero-stat-icon grid size-10 place-items-center rounded-md">
                  <Icon aria-hidden size={22} />
                </span>
                <span>
                  <span className="hero-stat-value block text-2xl leading-none font-semibold sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="hero-stat-label mt-1 block max-w-60 text-sm leading-5">
                    {stat.label}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      </div>
      <div className="border-border/70 bg-surface/85 relative z-10 border-t backdrop-blur-md">
        <div
          aria-label="Proof ticker"
          className="section-shell grid gap-3 py-4 text-sm font-semibold sm:grid-cols-2"
        >
          {proofTickerItems.map((item) => (
            <p className="text-muted" key={item}>
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
