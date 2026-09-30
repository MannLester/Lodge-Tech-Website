import Image from "next/image";
import Link from "next/link";
import auxiliaryImage from "@assets/auxiliary.png";
import exhaustImage from "@assets/exhaust.png";
import gemStatImage from "@assets/gem-stat-et/tree-setting.jpeg";
import gemLinkLogoBlue from "@assets/gem_link_logo_blue.png";
import gemLinkLogoWhite from "@assets/gem_link_logo_white.png";
import lightingImage from "@assets/lighting.png";
import platformImage from "@assets/platform-branded.png";

const supportingProducts = [
  {
    title: "GEM Link® Wireless – Lighting Control",
    image: lightingImage,
    slug: "lighting-controls",
    copy: "The right light, around real building use.",
  },
  {
    title: "GEM Link® Wireless – DHW Controls",
    image: auxiliaryImage,
    slug: "dhw-controls",
    copy: "Plan domestic hot water controls around property demand.",
  },
  {
    title: "GEM Link® Wireless – Appliance Controls",
    image: exhaustImage,
    slug: "appliance-controls",
    copy: "Bring overlooked loads into the conversation.",
  },
] as const;

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
              alt="GEM Stat™ ET thermostat pictured in a sunlit tree setting"
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
            <p className="chapter-label">Inside the HVAC solution</p>
            <h3>
              GEM Stat™<span className="product-suffix"> ET</span>
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
              <li>Connect with GEM Link® Wireless</li>
            </ul>
            <Link
              aria-label="Learn more about GEM Stat™ ET"
              className="editorial-link"
              href="/solutions/gem-stat-et"
            >
              Explore GEM Stat™ ET <span aria-hidden>↗</span>
            </Link>
          </div>
        </article>

        <article className="wireless-feature product-showcase">
          <div className="connected-property-panel">
            <p className="chapter-label">Connected property control</p>
            <h3 className="sr-only">GEM Link® Wireless HVAC</h3>
            <div className="wireless-platform-identity">
              <Image
                alt="GEM Link Wireless"
                className="wireless-platform-logo wireless-platform-logo-light"
                src={gemLinkLogoBlue}
              />
              <Image
                alt="GEM Link Wireless"
                className="wireless-platform-logo wireless-platform-logo-dark"
                src={gemLinkLogoWhite}
              />
            </div>
            <p className="connected-property-mode">HVAC</p>
            <figure className="wireless-platform-connection">
              <div className="wireless-platform-stage">
                <div className="wireless-platform-image">
                  <Image
                    alt="Lodging Technologies platform displayed on a laptop and phone"
                    className="object-contain"
                    fill
                    sizes="(max-width: 767px) 82vw, (max-width: 1023px) 65vw, 38vw"
                    src={platformImage}
                  />
                </div>
              </div>
              <div className="connection-loads">
                <span>HVAC</span>
                <span>Lighting</span>
                <span>Appliance</span>
              </div>
              <figcaption>
                GEM Link® Wireless brings supported room controls and building
                loads into a coordinated operating view.
              </figcaption>
            </figure>
          </div>

          <div className="beyond-hvac-panel">
            <h3>Beyond HVAC</h3>
            <div className="beyond-hvac-list">
              {supportingProducts.map((product) => (
                <article className="supporting-product" key={product.slug}>
                  <div className="supporting-product-image">
                    <Image
                      alt={product.title + " application illustration"}
                      className="object-cover"
                      fill
                      sizes="(max-width: 767px) 38vw, (max-width: 1023px) 28vw, 13vw"
                      src={product.image}
                    />
                  </div>
                  <div className="supporting-product-copy">
                    <h4>{product.title}</h4>
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
            <Link
              aria-label="Learn more about GEM Link® Wireless HVAC"
              className="editorial-link product-panel-link"
              href="/solutions/gem-link-wireless"
            >
              Explore GEM Link Wireless <span aria-hidden>↗</span>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
