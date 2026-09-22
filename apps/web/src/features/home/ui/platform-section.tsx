import Link from "next/link";

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
                  GEM Link Wireless connects supported controls and equipment.
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
          <p className="small-note">
            Illustrative system flow. Available capabilities depend on the
            selected equipment and configuration.
          </p>
        </div>
      </div>
    </section>
  );
}
