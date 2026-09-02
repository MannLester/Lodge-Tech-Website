import { turnkeySteps } from "@/features/home/model/home-content";
import { SectionHeading } from "@/shared/ui/section-heading";

export function ProcessSection() {
  return (
    <section
      aria-labelledby="process-heading"
      className="section-band bg-surface-muted"
    >
      <div className="section-shell">
        <SectionHeading
          align="center"
          description="One accountable team carries the work from initial analysis through long-term performance."
          eyebrow="The turnkey process"
          id="process-heading"
          title="We handle everything from start to finish."
        />

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {turnkeySteps.map((step, index) => (
            <li
              className="border-border bg-surface flex min-h-20 items-center gap-4 rounded-lg border p-4 lg:block lg:min-h-32"
              key={step}
            >
              <span className="bg-brand-fill grid h-9 w-12 shrink-0 place-items-center rounded-md text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span className="text-foreground text-base font-semibold lg:mt-5 lg:block">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
