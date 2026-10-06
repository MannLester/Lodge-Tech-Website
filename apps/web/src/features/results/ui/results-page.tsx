import Link from "next/link";

import { BrandText } from "@/shared/ui/brand-text";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";

const presentation = "/resources/duke-energy-presentation-2023.pdf";
const roomCosts = [
  { month: "October", before: "$3.36", after: "$2.94", savings: "13%" },
  { month: "November", before: "$2.93", after: "$2.65", savings: "10%" },
  { month: "December", before: "$2.71", after: "$2.41", savings: "11%" },
] as const;

export function ResultsPage() {
  return (
    <div className="marketing-site results-page" id="top">
      <SiteHeader fromHome={false} />
      <main>
        <section
          className="editorial-section results-hero"
          aria-labelledby="results-page-heading"
        >
          <div className="section-shell">
            <p className="chapter-label">Lodging Technologies / Results</p>
            <h1 className="display-heading" id="results-page-heading">
              Less energy waste.
              <br />
              More room for value.
            </h1>
            <p className="editorial-copy">
              A closer look at reported{" "}
              <BrandText>GEM Link® Wireless</BrandText> results. These property
              examples show how utility costs changed after occupancy controls
              were installed.
            </p>
            <a className="editorial-link" href="#property-results">
              Explore the results <span aria-hidden>↓</span>
            </a>
          </div>
        </section>

        <section
          className="editorial-section results-case-section"
          id="property-results"
          aria-labelledby="resort-results-heading"
        >
          <div className="section-shell results-case-layout">
            <div className="results-case-copy">
              <p className="chapter-label">
                01 / Five buildings, one comparison
              </p>
              <h2 className="display-heading" id="resort-results-heading">
                A resort’s utility costs,
                <br />
                before and after.
              </h2>
              <p className="editorial-copy">
                The March 2023 presentation reports results for a Northeast
                beach resort with five individually metered buildings. It
                compares June 2019, before installation, with June 2021, after
                installation.
              </p>
              <p className="editorial-copy">
                The presentation reports higher occupancy in June 2021 alongside
                lower combined energy consumption and utility expense. Demand
                and consumption changes varied between buildings.
              </p>
              <a
                className="editorial-link"
                href={`${presentation}#page=30`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View source, page 30{" "}
                <span className="sr-only">(PDF, opens in a new tab)</span>
                <span aria-hidden>↗</span>
              </a>
            </div>
            <div className="results-highlight">
              <p className="chapter-label">
                Reported combined utility-cost savings
              </p>
              <p className="results-metric">
                40.7<span>%</span>
              </p>
              <p className="results-highlight-description">
                Across five buildings in the June comparison
              </p>
              <dl className="results-costs">
                <div>
                  <dt>June 2019 · Before controls</dt>
                  <dd>$7,800.55</dd>
                </div>
                <div>
                  <dt>June 2021 · With controls</dt>
                  <dd>$4,626.62</dd>
                </div>
                <div>
                  <dt>Reported cost difference</dt>
                  <dd>$3,173.93</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          className="editorial-section results-room-section"
          aria-labelledby="room-results-heading"
        >
          <div className="section-shell">
            <div className="section-masthead">
              <div>
                <p className="chapter-label">02 / Cost per occupied room</p>
                <h2 className="display-heading" id="room-results-heading">
                  A different measure.
                  <br />A useful perspective.
                </h2>
              </div>
              <p className="editorial-copy">
                Another example compares total-property cost per occupied room
                for October through December in 2014 and 2015. The presentation
                reports monthly reductions of 10–13%.
              </p>
            </div>
            <div className="results-table-wrap">
              <table className="results-table">
                <caption>
                  Reported cost per occupied room · 2014 before / 2015 after GEM
                  Link®
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">2014 · Before</th>
                    <th scope="col">2015 · After</th>
                    <th scope="col">Reported savings</th>
                  </tr>
                </thead>
                <tbody>
                  {roomCosts.map((row) => (
                    <tr key={row.month}>
                      <th scope="row">{row.month}</th>
                      <td>{row.before}</td>
                      <td>{row.after}</td>
                      <td>{row.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a
              className="editorial-link"
              href={`${presentation}#page=26`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View source, page 26{" "}
              <span className="sr-only">(PDF, opens in a new tab)</span>
              <span aria-hidden>↗</span>
            </a>
          </div>
        </section>

        <section
          className="editorial-section results-context-section"
          aria-labelledby="results-context-heading"
        >
          <div className="section-shell results-case-layout">
            <div>
              <p className="chapter-label">Reading the results</p>
              <h2 className="display-heading" id="results-context-heading">
                Start with the context.
              </h2>
            </div>
            <div>
              <p className="editorial-copy">
                These are historical examples reported in{" "}
                <cite>Reducing kWh Energy and kW Demand… Comfortably</cite>,
                presented March 16, 2023. They measure different things:
                combined utility bills and cost per occupied room.
              </p>
              <p className="editorial-copy">
                The presentation does not provide a weather-normalized analysis
                or a complete account of other changes between the comparison
                periods. Results depend on equipment, climate, utility rates,
                and property operation; these examples are not a savings
                guarantee.
              </p>
              <a
                className="editorial-link"
                href={presentation}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the full presentation{" "}
                <span className="sr-only">(PDF, opens in a new tab)</span>
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="editorial-section results-next"
          aria-labelledby="results-next-heading"
        >
          <div className="section-shell results-case-layout">
            <div>
              <p className="chapter-label">Your property, your opportunity</p>
              <h2 className="display-heading" id="results-next-heading">
                What could change
                <br />
                in your building?
              </h2>
            </div>
            <div>
              <p className="editorial-copy">
                Let’s review your equipment, operating patterns, and utility
                costs to identify suitable opportunities.
              </p>
              <Link className="editorial-link" href="/request-for-proposal">
                Request a Proposal / Site Survey <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
