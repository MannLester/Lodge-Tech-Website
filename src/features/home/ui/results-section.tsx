import { ArrowRight } from "lucide-react";

import hospitalityImage from "../../../../assets/hospitality.png";
import multifamilyImage from "../../../../assets/multifamily.png";
import seniorLivingImage from "../../../../assets/senior_living.png";
import { caseStudies } from "@/features/home/model/home-content";
import { MediaImage } from "@/shared/ui/media-image";
import { SectionHeading } from "@/shared/ui/section-heading";

const caseStudyImages = [hospitalityImage, multifamilyImage, seniorLivingImage];

export function ResultsSection() {
  return (
    <section
      aria-labelledby="results-heading"
      className="section-band bg-background"
      id="results"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,2fr)] lg:items-start lg:gap-14">
        <SectionHeading
          description="Independent measurement and verification connects equipment performance to measurable operating outcomes."
          eyebrow="Proven results"
          id="results-heading"
          title="Real projects. Measurable savings."
        />

        <div className="snap-row md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
          {caseStudies.map((study, index) => (
            <article
              className="border-border bg-surface flex min-w-0 flex-col overflow-hidden rounded-lg border"
              key={study.sector}
            >
              <MediaImage
                alt={`${study.sector} case study property image`}
                className="aspect-[16/9] min-h-44 rounded-none border-x-0 border-t-0"
                sizes="(max-width: 767px) 82vw, 33vw"
                src={caseStudyImages[index]}
              />
              <div className="flex flex-1 flex-col p-5">
                <p className="eyebrow">{study.sector}</p>
                <p className="text-muted mt-2 text-sm">{study.location}</p>
                <div className="mt-6">
                  <p className="text-foreground text-4xl leading-none font-semibold">
                    {study.reduction}
                  </p>
                  <p className="text-muted mt-2 text-xs">
                    HVAC Runtime Reduction
                  </p>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-muted text-[0.68rem] font-semibold uppercase">
                      Utility Incentive
                    </dt>
                    <dd className="text-foreground mt-1 text-base font-semibold">
                      {study.utilityIncentive}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted text-[0.68rem] font-semibold uppercase">
                      Payback
                    </dt>
                    <dd className="text-foreground mt-1 text-base font-semibold">
                      {study.payback}
                    </dd>
                  </div>
                </dl>
                <a
                  className="text-brand-strong hover:text-brand mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold transition-colors"
                  href="#contact"
                >
                  View Case Study
                  <ArrowRight aria-hidden size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="text-muted text-xs leading-5 lg:col-span-2">
          Reference-design figures are provisional and require client
          verification before production launch.
        </p>
      </div>
    </section>
  );
}
