import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  HeartPulse,
  Hotel,
} from "lucide-react";

import { industries } from "@/features/home/model/home-content";
import { MediaPlaceholder } from "@/shared/ui/media-placeholder";
import { SectionHeading } from "@/shared/ui/section-heading";

const industryIcons = [
  Hotel,
  Building2,
  HeartPulse,
  GraduationCap,
  BriefcaseBusiness,
] as const;

export function IndustriesSection() {
  return (
    <section
      aria-labelledby="industries-heading"
      className="section-band bg-surface-muted"
      id="industries"
    >
      <div className="section-shell">
        <SectionHeading
          align="center"
          description="Flexible energy-management strategies built around how each property is actually occupied and operated."
          eyebrow="Built for every industry"
          id="industries-heading"
          title="One platform, many property types."
        />

        <div className="snap-row mt-10 md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:overflow-visible lg:grid-cols-5">
          {industries.map((industry, index) => {
            const Icon = industryIcons[index];

            return (
              <article className="min-w-0" key={industry.title}>
                <div className="relative">
                  <MediaPlaceholder
                    className="aspect-[4/3] min-h-44 lg:min-h-0"
                    label={industry.mediaLabel}
                  />
                  <span className="border-background bg-brand-fill shadow-card absolute -bottom-5 left-4 grid size-11 place-items-center rounded-lg border text-white">
                    <Icon aria-hidden size={22} />
                  </span>
                </div>
                <div className="pt-9">
                  <h3 className="text-foreground text-lg font-semibold">
                    {industry.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {industry.description}
                  </p>
                  <a
                    className="text-brand-strong mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                    href="#contact"
                  >
                    Learn More
                    <ArrowRight aria-hidden size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
