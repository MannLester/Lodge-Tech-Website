import {
  Calculator,
  ChartNoAxesCombined,
  CircleDollarSign,
  Wrench,
  Zap,
} from "lucide-react";

import { valuePropositions } from "@/features/home/model/home-content";
import { SectionHeading } from "@/shared/ui/section-heading";

const valueIcons = [
  Zap,
  ChartNoAxesCombined,
  CircleDollarSign,
  Calculator,
  Wrench,
] as const;

export function ValueSection() {
  return (
    <section
      aria-labelledby="value-heading"
      className="section-band bg-background"
      id="solutions"
    >
      <div className="section-shell">
        <SectionHeading
          align="center"
          description="We combine proven technology, utility incentives, and turnkey execution to deliver positive cash flow from month one."
          eyebrow="Energy follows occupancy"
          id="value-heading"
          title="Smarter control. Real results."
        />

        <div className="snap-row mt-10 md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:overflow-visible lg:grid-cols-5">
          {valuePropositions.map((item, index) => {
            const Icon = valueIcons[index];

            return (
              <article
                className="border-border bg-surface rounded-lg border p-5"
                key={item.title}
              >
                <div className="border-brand text-brand grid size-11 place-items-center rounded-full border">
                  <Icon aria-hidden size={22} />
                </div>
                <h3 className="text-foreground mt-5 text-base font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted mt-2 text-sm leading-6">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
