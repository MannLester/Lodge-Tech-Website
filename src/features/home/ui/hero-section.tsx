import {
  Activity,
  BadgeDollarSign,
  Building2,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";

import heroHouseImage from "../../../../assets/day_house.png";
import { proofStats } from "@/features/home/model/home-content";
import { ButtonLink } from "@/shared/ui/button-link";

const statIcons = [CalendarDays, Building2, Activity, BadgeDollarSign] as const;

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-[#dbe8ef] bg-[#f7fbfd]"
      id="technology"
    >
      <div className="absolute inset-0 z-0">
        <Image
          alt=""
          className="object-cover object-[58%_center]"
          fill
          placeholder="blur"
          preload
          quality={95}
          sizes="100vw"
          src={heroHouseImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_28%,rgba(255,255,255,0.58)_43%,rgba(255,255,255,0.12)_62%,rgba(255,255,255,0)_78%)] lg:bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_25%,rgba(255,255,255,0.5)_40%,rgba(255,255,255,0.08)_57%,rgba(255,255,255,0)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(247,251,253,0.34)_0%,rgba(247,251,253,0)_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.62)_72%,rgba(255,255,255,0)_100%)] lg:hidden" />
      </div>

      <div className="section-shell relative z-10 grid gap-10 py-16 sm:py-20 lg:min-h-[calc(100dvh-4.25rem)] lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-16">
        <div className="max-w-2xl lg:col-span-6 lg:-translate-x-10 lg:pr-4 xl:-translate-x-14">
          <p className="flex items-center gap-3 text-[0.6875rem] leading-tight font-bold tracking-[0.18em] text-[#007fa9] uppercase">
            <span className="h-0.5 w-6 bg-[#007fa9]" aria-hidden />
            Proven experience. Intelligent solutions.
          </p>
          <h1
            className="mt-6 text-4xl leading-[1.04] font-semibold text-[#0b1324] sm:text-5xl"
            id="hero-heading"
          >
            Energy wasted
            <br />
            is money lost.{" "}
            <span className="mt-2 block text-[#008ec5]">
              We make buildings
              <br />
              use less.
            </span>
          </h1>
          <p className="mt-7 max-w-[22rem] text-sm leading-6 text-[#273647] sm:max-w-[31rem] sm:text-base sm:leading-7">
            Intelligent energy management that reduces HVAC runtime, lowers
            demand, and delivers real savings without compromising comfort.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              className="!border-[#008ec5] !bg-[#008ec5] px-6 !text-white hover:!border-[#007fa9] hover:!bg-[#007fa9]"
              href="#contact"
            >
              Get a Free Savings Analysis
            </ButtonLink>
            <ButtonLink
              className="!border-[#172033] !bg-transparent px-6 !text-[#172033] hover:!border-[#008ec5] hover:!text-[#008ec5]"
              href="#platform"
              variant="outline"
            >
              Request a Demo
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg border border-white/55 bg-white/58 p-5 shadow-[0_24px_70px_rgb(11_19_36_/_0.18)] backdrop-blur-md sm:p-6 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
          {proofStats.map((stat, index) => {
            const Icon = statIcons[index];

            return (
              <article
                className="grid grid-cols-[3rem_1fr] items-center gap-x-4 py-4 first:pt-0 last:pb-0"
                key={stat.label}
              >
                <span className="grid size-10 place-items-center rounded-md bg-[#eef8fb] text-[#008ec5] shadow-[0_1px_0_rgb(255_255_255_/_0.8)]">
                  <Icon aria-hidden size={22} />
                </span>
                <span>
                  <span className="block text-2xl leading-none font-semibold text-[#0b1324] sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block max-w-60 text-sm leading-5 text-[#37475a]">
                    {stat.label}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
