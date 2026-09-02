import { Check } from "lucide-react";

import { ButtonLink } from "@/shared/ui/button-link";
import { MediaPlaceholder } from "@/shared/ui/media-placeholder";

const platformCapabilities = [
  "Real-time portfolio visibility",
  "Advanced analytics and alarms",
  "Diagnostics and benchmarking",
  "Predictive operating insights",
] as const;

export function PlatformSection() {
  return (
    <section
      aria-labelledby="platform-heading"
      className="section-band bg-background"
      id="platform"
    >
      <div className="section-shell grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <MediaPlaceholder
            className="shadow-soft aspect-[16/10] min-h-64"
            label="Cloud dashboard and connected device imagery"
          />
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5">
          <p className="eyebrow">The platform</p>
          <h2
            className="text-foreground mt-3 text-3xl leading-tight font-semibold sm:text-4xl"
            id="platform-heading"
          >
            Building intelligence in the cloud.
          </h2>
          <p className="text-muted mt-5 text-base leading-7">
            Monitor, analyze, and optimize properties from one connected view.
            The platform surfaces the information teams need to act quickly and
            operate intelligently.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {platformCapabilities.map((capability) => (
              <li className="flex items-center gap-3 text-sm" key={capability}>
                <span className="bg-brand-soft text-brand-strong grid size-6 shrink-0 place-items-center rounded-full">
                  <Check aria-hidden size={15} strokeWidth={2.5} />
                </span>
                <span>{capability}</span>
              </li>
            ))}
          </ul>
          <ButtonLink className="mt-8" href="#contact" showArrow variant="text">
            Explore the Platform
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
