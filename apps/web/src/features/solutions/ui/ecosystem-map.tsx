"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import {
  products,
  type ProductSlug,
} from "@/features/solutions/model/product-content";
import {
  DoorContactIcon,
  HvacIcon,
  LightingIcon,
  PirSensorIcon,
  ThermostatIcon,
  TransceiverIcon,
} from "@/features/solutions/ui/solution-system-icons";
import { BrandText } from "@/shared/ui/brand-text";
import { ButtonLink } from "@lodging-technologies/ui/button-link";

type EcosystemMapProps = {
  currentSlug: ProductSlug;
};

type SolutionNodeProps = {
  children: string;
  icon: ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  overline: string;
  slug: ProductSlug;
};

type AvailableProductSlug = Exclude<ProductSlug, "appliance-controls">;

const connectionDescriptions: Record<AvailableProductSlug, string> = {
  "gem-stat-et":
    "A complementary room-level thermostat solution for occupancy-aware HVAC control. It is shown beside the GEM Link control path without implying a direct wired connection.",
  "gem-link-wireless":
    "The transceiver receives room signals and applies the configured control strategy to supported HVAC equipment.",
  "lighting-controls":
    "A GEM Link control path can use shared occupancy and door signals to manage suitable lighting loads.",
};

function SolutionNode({
  children,
  icon,
  isSelected,
  onSelect,
  overline,
  slug,
}: SolutionNodeProps) {
  return (
    <button
      aria-pressed={isSelected}
      className="ecosystem-solution-node"
      data-solution-node={slug}
      onClick={onSelect}
      type="button"
    >
      <span className="ecosystem-node-icon">{icon}</span>
      <span>
        <span className="ecosystem-node-overline">{overline}</span>
        <strong>
          <BrandText>{children}</BrandText>
        </strong>
      </span>
    </button>
  );
}

export function EcosystemMap({ currentSlug }: EcosystemMapProps) {
  const [selectedSlug, setSelectedSlug] = useState<AvailableProductSlug>(
    currentSlug === "appliance-controls" ? "gem-link-wireless" : currentSlug,
  );
  const selected =
    products.find((product) => product.slug === selectedSlug) ?? products[0];

  return (
    <div className="ecosystem-experience">
      <div className="ecosystem-legend" aria-label="Diagram legend">
        <span>
          <i className="ecosystem-legend-line" aria-hidden />
          GEM Link control path
        </span>
        <span>
          <i className="ecosystem-legend-outline" aria-hidden />
          Complementary room solution
        </span>
      </div>

      <div
        aria-label="Connected solution diagram"
        className="ecosystem-diagram"
        data-testid="connected-solution-diagram"
        role="group"
      >
        <div className="ecosystem-thermostat-path">
          <p>Complementary room control</p>
          <SolutionNode
            icon={<ThermostatIcon />}
            isSelected={selectedSlug === "gem-stat-et"}
            onSelect={() => setSelectedSlug("gem-stat-et")}
            overline="Occupancy-based thermostat"
            slug="gem-stat-et"
          >
            GEM Stat™ ET
          </SolutionNode>
        </div>

        <div className="ecosystem-affinity-flow" aria-hidden>
          <span>Separate room-comfort path</span>
          <i />
        </div>

        <section
          className="ecosystem-signal-card"
          aria-labelledby="signals-title"
        >
          <p className="ecosystem-stage-label">01 / Sense</p>
          <h3 id="signals-title">Room signals</h3>
          <div className="ecosystem-signal-list">
            <div>
              <PirSensorIcon />
              <span>PIR occupancy sensor</span>
            </div>
            <div>
              <DoorContactIcon />
              <span>Entry and balcony contacts</span>
            </div>
          </div>
        </section>

        <div className="ecosystem-flow ecosystem-flow-input" aria-hidden>
          <span>Wireless signals</span>
          <i />
        </div>

        <section
          className="ecosystem-control-card"
          aria-labelledby="control-title"
        >
          <p className="ecosystem-stage-label">02 / Decide</p>
          <h3 id="control-title">Control layer</h3>
          <SolutionNode
            icon={<TransceiverIcon />}
            isSelected={selectedSlug === "gem-link-wireless"}
            onSelect={() => setSelectedSlug("gem-link-wireless")}
            overline="Transceiver control module"
            slug="gem-link-wireless"
          >
            GEM Link® Wireless – HVAC
          </SolutionNode>
        </section>

        <div className="ecosystem-flow ecosystem-flow-output" aria-hidden>
          <span>Configured response</span>
          <i />
        </div>

        <section className="ecosystem-load-card" aria-labelledby="loads-title">
          <p className="ecosystem-stage-label">03 / Act</p>
          <h3 id="loads-title">Managed loads</h3>
          <div className="ecosystem-load-list">
            <div className="ecosystem-static-load">
              <span className="ecosystem-node-icon">
                <HvacIcon />
              </span>
              <span>
                <small>Supported equipment</small>
                <strong>HVAC</strong>
              </span>
            </div>
            <SolutionNode
              icon={<LightingIcon />}
              isSelected={selectedSlug === "lighting-controls"}
              onSelect={() => setSelectedSlug("lighting-controls")}
              overline="Suitable lighting loads"
              slug="lighting-controls"
            >
              GEM Link® Wireless – Lighting Control
            </SolutionNode>
          </div>
        </section>
      </div>

      <div aria-live="polite" className="ecosystem-detail">
        <div>
          <p className="ecosystem-stage-label">Selected solution</p>
          <h3>
            <BrandText>{selected.label}</BrandText>
          </h3>
          <p>{connectionDescriptions[selectedSlug]}</p>
        </div>
        {selected.slug === currentSlug ? (
          <p className="ecosystem-current">You are viewing this solution.</p>
        ) : (
          <ButtonLink
            href={`/solutions/${selected.slug}`}
            showArrow
            variant="outline"
          >
            Explore {selected.label}
          </ButtonLink>
        )}
      </div>

      <p className="ecosystem-source-note">
        Solid lines trace the documented GEM Link® control path. GEM Stat™ ET is
        presented as a complementary room-level HVAC solution.
      </p>
    </div>
  );
}
