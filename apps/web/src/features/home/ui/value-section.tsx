import {
  Calculator,
  ChartNoAxesCombined,
  CircleDollarSign,
  Wrench,
  Zap,
} from "lucide-react";

import { valuePropositions } from "@/features/home/model/home-content";
import { SectionHeading } from "@lodging-technologies/ui/section-heading";
import { ContinuousScroller } from "./continuous-scroller";

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
          description="Lodging Technologies aligns controls, incentives, and turnkey execution around measurable building operating expense."
          eyebrow="Energy follows occupancy"
          id="value-heading"
          title="Reduce waste where buildings actually spend energy."
        />

        <ContinuousScroller className="mt-10 md:auto-cols-auto md:grid-flow-row md:grid-cols-2 lg:grid-cols-5">
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
        </ContinuousScroller>
      </div>
    </section>
  );
}
