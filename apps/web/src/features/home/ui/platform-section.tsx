import Link from "next/link";

import { ConnectedViewGraph } from "@/features/solutions";
import { BrandText } from "@/shared/ui/brand-text";

export function PlatformSection() {
  return (
    <section
      aria-labelledby="platform-heading"
      className="platform-section editorial-section"
      id="platform"
    >
      <div className="section-shell platform-layout">
        <div>
          <p className="chapter-label">03 / The bigger picture</p>
          <h2 className="display-heading" id="platform-heading">
            Closer to every room.
            <br />
            <span>From wherever you are.</span>
          </h2>
          <p className="editorial-copy">
            Connect room-level intelligence with a property-wide view. Help your
            team understand operating patterns and focus attention where it
            matters.
          </p>
          <Link
            className="editorial-link"
            href="/?product=gem-link-wireless&intent=demo#contact"
          >
            Request Platform Demo <span aria-hidden>↗</span>
          </Link>
        </div>
        <div className="platform-story">
          <p className="chapter-label">From space to insight</p>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>Sense the space</h3>
                <p>Occupancy signals provide context for room-level control.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Connect the property</h3>
                <p>
                  <BrandText>GEM Link® Wireless</BrandText> connects supported
                  controls and equipment.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>See what matters</h3>
                <p>
                  Use operating information to guide review and adjustments.
                </p>
              </div>
            </li>
          </ol>
        </div>
        <figure className="platform-flow-figure">
          <figcaption>
            <p className="chapter-label">Connected view</p>
            <h3>From room signal to building insight.</h3>
            <p>
              Follow occupancy sensing through supported controls to operating
              information your team can review.
            </p>
          </figcaption>
          <ConnectedViewGraph />
        </figure>
      </div>
    </section>
  );
}
