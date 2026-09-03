import { ArrowRight } from "lucide-react";

import { caseStudies } from "@/features/home/model/home-content";
import { SectionHeading } from "@lodging-technologies/ui/section-heading";

export function ResultsSection() {
  return (
    <section
      aria-labelledby="results-heading"
      className="section-band bg-background"
      id="results"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,2fr)] lg:items-start lg:gap-14">
        <div>
          <SectionHeading
            description="Exact savings, payback, and incentive values should be approved per project. This section now uses evidence-safe language until final case-study substantiation is supplied."
            eyebrow="Proof without overclaiming"
            id="results-heading"
            title="A practical path from opportunity to verified performance."
          />
          <a
            className="text-brand-strong hover:text-brand mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            href="#contact"
          >
            Start a Savings Review
            <ArrowRight aria-hidden size={15} />
          </a>
        </div>

        <div className="snap-row md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
          {caseStudies.map((study) => (
            <article
              className="border-border bg-surface flex min-w-0 flex-col rounded-lg border p-5"
              key={study.sector}
            >
              <div className="flex flex-1 flex-col">
                <p className="eyebrow">
                  {study.sector} <span aria-hidden>/</span> {study.location}
                </p>
                <p className="text-muted mt-2 text-sm">{study.property}</p>
                <div className="mt-6">
                  <p className="text-foreground text-3xl leading-none font-semibold">
                    {study.reduction}
                  </p>
                  <p className="text-muted mt-2 text-xs">
                    Controllable Load Focus
                  </p>
                </div>
                <dl className="mt-6 grid gap-5">
                  <div>
                    <dd className="text-foreground text-base font-semibold">
                      {study.utilityIncentive}
                    </dd>
                    <dt className="text-muted mt-1 text-[0.68rem] uppercase">
                      Utility Incentive Review
                    </dt>
                  </div>
                  <div>
                    <dd className="text-foreground text-base font-semibold">
                      {study.payback}
                    </dd>
                    <dt className="text-muted mt-1 text-[0.68rem] uppercase">
                      Payback Status
                    </dt>
                  </div>
                </dl>
                <a
                  className="text-brand-strong hover:text-brand mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold transition-colors"
                  href="#contact"
                >
                  Request Details
                  <ArrowRight aria-hidden size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
