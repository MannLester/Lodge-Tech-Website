import Image from "next/image";
import Link from "next/link";
import gemStatImage from "@assets/gem-stat-et/tree-setting.jpeg";
import lightingImage from "@assets/lighting.png";
import auxiliaryImage from "@assets/auxiliary.png";
import platformImage from "@assets/platform.png";

export function ProductSection() {
  return (
    <section
      aria-labelledby="products-heading"
      className="editorial-section product-section"
      id="solutions"
    >
      <div className="section-shell">
        <div className="section-masthead">
          <div>
            <p className="chapter-label">02 / Meet the technology</p>
            <h2 className="display-heading" id="products-heading">
              Small details.
              <br />
              Building-wide impact.
            </h2>
          </div>
          <p className="editorial-copy">
            From a single guest room to a connected property. Discover the
            controls behind a more efficient building.
          </p>
        </div>
        <article className="flagship-product">
          <div className="flagship-photo">
            <Image
              alt="GEM Stat ET thermostat pictured in a sunlit tree setting"
              className="object-cover object-left"
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 92vw, 62vw"
              src={gemStatImage}
            />
            <span className="photo-caption">
              Designed around the spaces people use.
            </span>
          </div>
          <div className="flagship-copy">
            <p className="chapter-label">Room-level intelligence</p>
            <h3>
              GEM Stat<span className="product-suffix"> ET</span>
            </h3>
            <p className="product-statement">
              A comfortable room.
              <br />A smarter way to run it.
            </p>
            <p className="editorial-copy">
              Occupancy-based HVAC control helps reduce avoidable runtime while
              keeping comfort close at hand.
            </p>
            <ul className="editorial-list">
              <li>Respond to room occupancy</li>
              <li>Support guest comfort</li>
              <li>Connect with GEM Link Wireless</li>
            </ul>
            <Link
              aria-label="Learn more about GEM Stat ET"
              className="editorial-link"
              href="/solutions/gem-stat-et"
            >
              Explore GEM Stat ET <span aria-hidden>↗</span>
            </Link>
          </div>
        </article>
        <article className="wireless-feature">
          <div>
            <p className="chapter-label">Connected property control</p>
            <h3>
              Every room.
              <br />
              <span className="muted-heading">Working together.</span>
            </h3>
            <p className="editorial-copy">
              GEM Link Wireless brings supported room controls and building
              loads into a coordinated operating view.
            </p>
            <Link
              aria-label="Learn more about GEM Link Wireless"
              className="editorial-link"
              href="/solutions/gem-link-wireless"
            >
              Explore GEM Link Wireless <span aria-hidden>↗</span>
            </Link>
          </div>
          <div className="wireless-visual-story">
            <div
              aria-label="Illustration of GEM Link Wireless connecting HVAC, lighting and appliances"
              className="connection-diagram"
              role="img"
            >
              <div className="connection-core">
                <span className="connection-orbit" aria-hidden />
                <span>
                  GEM Link<small>Wireless</small>
                </span>
              </div>
              <div className="connection-loads">
                <span>HVAC</span>
                <span>Lighting</span>
                <span>Appliances</span>
              </div>
              <p className="small-note">Connected ecosystem illustration</p>
            </div>
            <figure className="wireless-platform-preview">
              <div className="wireless-platform-preview-image">
                <Image
                  alt="GEM Link Wireless platform illustrated on laptop and phone screens"
                  className="object-contain"
                  fill
                  sizes="(max-width: 767px) 92vw, (max-width: 1279px) 55vw, 48vw"
                  src={platformImage}
                />
              </div>
              <figcaption>
                <strong>One connected view.</strong>
                <span>From room controls to property-wide visibility.</span>
                <span className="small-note">Illustrative platform view.</span>
              </figcaption>
            </figure>
          </div>
        </article>
        <div className="supporting-products">
          {[
            {
              title: "Lighting Controls",
              image: lightingImage,
              slug: "lighting-controls",
              copy: "The right light, around real building use.",
            },
            {
              title: "Appliance Controls",
              image: auxiliaryImage,
              slug: "appliance-controls",
              copy: "Bring overlooked loads into the conversation.",
            },
          ].map((product) => (
            <article className="supporting-product" key={product.slug}>
              <div className="supporting-product-image">
                <Image
                  alt={product.title + " application illustration"}
                  className="object-contain"
                  fill
                  sizes="(max-width: 767px) 35vw, 20vw"
                  src={product.image}
                />
              </div>
              <div>
                <p className="chapter-label">Beyond HVAC</p>
                <h3>{product.title}</h3>
                <p>{product.copy}</p>
                <Link
                  aria-label={"Learn more about " + product.title}
                  className="editorial-link"
                  href={"/solutions/" + product.slug}
                >
                  Explore controls <span aria-hidden>↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
