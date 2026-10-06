import Link from "next/link";

import {
  DoorContactIcon,
  HvacIcon,
  LightingIcon,
  OperatingViewIcon,
  PirSensorIcon,
  TransceiverIcon,
} from "@/features/solutions/ui/solution-system-icons";
import { BrandText } from "@/shared/ui/brand-text";

export function ConnectedViewGraph() {
  return (
    <div className="connected-view-experience">
      <div className="connected-view-legend" aria-label="Connection legend">
        <span>
          <i aria-hidden />
          Room control
        </span>
        <span>
          <i className="connected-view-review-line" aria-hidden />
          Illustrative review
        </span>
      </div>
      <ol
        className="connected-view-graph"
        aria-label="From room signals to property review"
      >
        <li>
          <p className="chapter-label">01 / Sense</p>
          <h4>Room signals</h4>
          <div className="connected-view-node-list">
            <div>
              <PirSensorIcon />
              <span>PIR occupancy sensor</span>
            </div>
            <div>
              <DoorContactIcon />
              <span>Entry &amp; balcony contacts</span>
            </div>
          </div>
        </li>
        <li>
          <p className="chapter-label">02 / Control</p>
          <h4>Configured response</h4>
          <div className="connected-view-primary-icon">
            <TransceiverIcon />
          </div>
          <Link
            className="connected-view-product-link"
            href="/solutions/gem-link-wireless"
          >
            <BrandText>GEM Link® Wireless</BrandText>
          </Link>
          <p className="connected-view-node-copy">Transceiver control module</p>
        </li>
        <li className="connected-view-review-source">
          <p className="chapter-label">03 / Act</p>
          <h4>Supported loads</h4>
          <div className="connected-view-node-list">
            <Link href="/solutions/gem-link-wireless">
              <HvacIcon />
              <span>HVAC equipment</span>
            </Link>
            <Link href="/solutions/lighting-controls">
              <LightingIcon />
              <span>Lighting controls</span>
            </Link>
          </div>
        </li>
        <li>
          <p className="chapter-label">04 / Review</p>
          <h4>Building insight</h4>
          <div className="connected-view-primary-icon">
            <OperatingViewIcon />
          </div>
          <p className="connected-view-node-copy">
            Review operating patterns.
            <br />
            Guide adjustments.
          </p>
        </li>
      </ol>
      <p className="small-note">
        Illustrative system flow. The dashed connection represents a property
        review, with available information dependent on equipment and
        configuration.
      </p>
    </div>
  );
}
