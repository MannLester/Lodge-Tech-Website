import Link from "next/link";

import { companyProfile } from "@/features/company/model/company-profile";
import { CompanyImageSlider } from "@/features/home";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";

export function CompanyPage() {
  return (
    <div className="marketing-site company-page" id="top">
      <SiteHeader fromHome={false} />
      <main>
        <section
          aria-labelledby="company-page-heading"
          className="company-page-hero"
        >
          <div className="section-shell company-page-hero-layout">
            <div className="company-page-hero-copy">
              <p className="chapter-label">Lodging Technologies / Company</p>
              <h1 id="company-page-heading">
                Who <em>we are.</em>
              </h1>
              <p className="company-page-declaration">
                Experience, technology, efficiency, and a forward-looking
                vision.
              </p>
              <p className="company-page-introduction">
                {companyProfile.introduction}
              </p>
              <a className="company-page-scroll-link" href="#our-direction">
                Discover what drives us <span aria-hidden>↓</span>
              </a>
            </div>
            <div className="company-page-gallery">
              <CompanyImageSlider />
              <p>Places, people, and technology in focus.</p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="direction-heading"
          className="company-page-direction"
          id="our-direction"
        >
          <div className="section-shell">
            <div className="company-page-section-heading">
              <p className="chapter-label">What guides the work</p>
              <h2 id="direction-heading">Our direction.</h2>
            </div>
            <div className="company-page-statement">
              <div>
                <span>01</span>
                <h3>Vision</h3>
              </div>
              <p>{companyProfile.vision}</p>
            </div>
            <div className="company-page-statement">
              <div>
                <span>02</span>
                <h3>Mission</h3>
              </div>
              <p>{companyProfile.mission}</p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="values-heading"
          className="company-page-values"
        >
          <div className="section-shell company-page-values-layout">
            <div>
              <p className="chapter-label">The principles behind the work</p>
              <h2 id="values-heading">
                Our <em>values.</em>
              </h2>
            </div>
            <ol>
              {companyProfile.values.map((value, index) => (
                <li key={value}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="company-next-heading"
          className="company-page-next"
        >
          <div className="section-shell company-page-next-layout">
            <div>
              <p className="chapter-label">The next conversation</p>
              <h2 id="company-next-heading">
                Let&apos;s start with your property.
              </h2>
            </div>
            <div>
              <p>Tell us about your building and what you want to explore.</p>
              <Link
                className="company-page-primary-link"
                href="/request-for-proposal"
              >
                Request a proposal <span aria-hidden>↗</span>
              </Link>
              <Link className="company-page-secondary-link" href="/#contact">
                Or send a general inquiry
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
