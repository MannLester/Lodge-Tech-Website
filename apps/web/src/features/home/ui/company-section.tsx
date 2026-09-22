import { Check } from "lucide-react";

import { companyProfile } from "@/features/home/model/home-content";
import { CompanyImageSlider } from "@/features/home/ui/company-image-slider";

export function CompanySection() {
  return (
    <section
      aria-labelledby="company-heading"
      className="section-band bg-background"
      id="company"
    >
      <div className="section-shell">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <CompanyImageSlider />

          <div>
            <p className="eyebrow">Who we are</p>
            <h2
              className="text-foreground mt-3 text-3xl leading-tight font-semibold sm:text-4xl"
              id="company-heading"
            >
              Experience, technology, efficiency, and a forward-looking vision.
            </h2>
            <p className="text-muted mt-5 text-base leading-7">
              {companyProfile.introduction}
            </p>
            <p className="text-brand-strong mt-6 text-sm font-semibold uppercase">
              Connection · Data · Movement · Technology · Efficiency
            </p>
          </div>
        </div>

        <div className="border-border mt-14 grid border-y lg:grid-cols-2">
          <article className="border-border py-8 lg:border-r lg:pr-10">
            <p className="eyebrow">Vision</p>
            <p className="text-foreground mt-3 text-lg leading-8 font-medium">
              {companyProfile.vision}
            </p>
          </article>
          <article className="border-border border-t py-8 lg:border-t-0 lg:pl-10">
            <p className="eyebrow">Mission</p>
            <p className="text-foreground mt-3 text-lg leading-8 font-medium">
              {companyProfile.mission}
            </p>
          </article>
        </div>

        <div className="mt-10">
          <p className="eyebrow text-center">Our values</p>
          <ul
            className="mx-auto mt-10 grid max-w-xs gap-4 sm:max-w-2xl sm:grid-cols-2 lg:max-w-none lg:grid-cols-5"
            data-company-values
          >
            {companyProfile.values.map((value) => (
              <li
                className="text-foreground grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3 text-base leading-6 font-semibold lg:justify-self-center lg:text-lg"
                key={value}
              >
                <span className="company-value-check bg-brand-soft text-brand-strong grid size-7 shrink-0 place-items-center rounded-full">
                  <Check aria-hidden size={15} strokeWidth={2.5} />
                </span>
                {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
