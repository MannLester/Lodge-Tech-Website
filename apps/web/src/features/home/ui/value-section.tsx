import { Cpu, Gauge, HeartHandshake } from "lucide-react";

import { brandPillars } from "@/features/home/model/home-content";
import { MobileCarousel } from "@/shared/ui/mobile-carousel";
import { SectionHeading } from "@lodging-technologies/ui/section-heading";

const pillarIcons = [Cpu, Gauge, HeartHandshake] as const;

export function ValueSection() {
  return (
    <section
      aria-labelledby="value-heading"
      className="section-band bg-background"
      id="value"
    >
      <div className="section-shell">
        <SectionHeading
          align="center"
          description="Sensors, automation, and control systems detect whether a space is occupied or vacant, enabling intelligent adjustment of energy consumption."
          eyebrow="Energy follows occupancy"
          id="value-heading"
          title="Technology that understands spaces."
        />

        <MobileCarousel
          ariaLabel="Brand pillars"
          className="mt-10 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible"
        >
          {brandPillars.map((item, index) => {
            const Icon = pillarIcons[index];

            return (
              <article
                className="border-border bg-surface rounded-lg border p-6"
                key={item.title}
              >
                <div className="bg-brand-soft text-brand-strong grid size-11 place-items-center rounded-md">
                  <Icon aria-hidden size={22} />
                </div>
                <h3 className="text-foreground mt-5 text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted mt-2 text-sm leading-6">
                  {item.description}
                </p>
              </article>
            );
          })}
        </MobileCarousel>
      </div>
    </section>
  );
}
