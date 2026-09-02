import { ArrowRight } from "lucide-react";

import { caseStudies } from "@/features/home/model/home-content";
import { MediaPlaceholder } from "@/shared/ui/media-placeholder";
import { SectionHeading } from "@/shared/ui/section-heading";

export function ResultsSection() {
  return (
    <section
      aria-labelledby="results-heading"
      className="section-band bg-background"
      id="results"
    >
      <div className="section-shell">
        <SectionHeading
          description="Independent measurement and verification connects equipment performance to measurable operating outcomes."
          eyebrow="Proven results"
          id="results-heading"
          title="Real projects. Measurable savings."
        />

        <div className="snap-row mt-10 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
          {caseStudies.map((study) => (
            <article
              className="border-border bg-surface overflow-hidden rounded-lg border"
              key={study.sector}
            >
              <MediaPlaceholder
                className="aspect-[16/9] min-h-44 rounded-none border-x-0 border-t-0"
                label={`${study.sector} case study property image`}
              />
              <div className="p-5">
                <p className="eyebrow">{study.sector}</p>
                <p className="text-muted mt-2 text-sm">{study.location}</p>
                <dl className="border-border mt-5 grid grid-cols-3 gap-3 border-y py-4">
                  <div>
                    <dt className="text-muted text-[0.68rem] font-semibold uppercase">
                      Runtime
                    </dt>
                    <dd className="text-foreground mt-1 text-xl font-semibold">
                      {study.reduction}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted text-[0.68rem] font-semibold uppercase">
                      Incentive
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
                  className="text-brand-strong mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                  href="#contact"
                >
                  View Case Study
                  <ArrowRight aria-hidden size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="text-muted mt-5 text-xs leading-5">
          Reference-design figures are provisional and require client
          verification before production launch.
        </p>
      </div>
    </section>
  );
}
