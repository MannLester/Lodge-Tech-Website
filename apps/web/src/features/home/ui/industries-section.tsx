import { ArrowRight } from "lucide-react";

import dayNightImage from "../../../../assets/day_night.png";
import hospitalityImage from "../../../../assets/hospitality.png";
import multifamilyImage from "../../../../assets/multifamily.png";
import seniorLivingImage from "../../../../assets/senior_living.png";
import studentHousingImage from "../../../../assets/student_housing.png";
import { industries } from "@/features/home/model/home-content";
import { MediaImage } from "@lodging-technologies/ui/media-image";
import { SectionHeading } from "@lodging-technologies/ui/section-heading";
import { ContinuousScroller } from "./continuous-scroller";

const industryImages = [
  hospitalityImage,
  multifamilyImage,
  seniorLivingImage,
  studentHousingImage,
  dayNightImage,
];

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
          description="Flexible energy-management strategies for properties with repeatable rooms, variable occupancy, and meaningful controllable loads."
          eyebrow="Industries"
          id="industries-heading"
          title="Built for lodging and residential-scale portfolios."
        />

        <ContinuousScroller className="mt-10 md:auto-cols-auto md:grid-flow-row md:grid-cols-2 lg:grid-cols-5">
          {industries.map((industry, index) => {
            const image = industryImages[index];

            return (
              <article
                className="border-border bg-surface flex min-w-0 flex-col overflow-hidden rounded-lg border"
                key={industry.title}
              >
                <MediaImage
                  alt={industry.mediaLabel}
                  className="aspect-[4/3] min-h-44 rounded-none border-x-0 border-t-0 lg:min-h-0"
                  sizes="(max-width: 767px) 82vw, (max-width: 1023px) 45vw, 20vw"
                  src={image}
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-foreground text-lg font-semibold">
                    {industry.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {industry.description}
                  </p>
                  <a
                    className="text-brand-strong hover:text-brand mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold transition-colors"
                    href="#contact"
                  >
                    Learn More
                    <ArrowRight aria-hidden size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </ContinuousScroller>
      </div>
    </section>
  );
}
