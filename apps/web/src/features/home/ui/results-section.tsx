export function ResultsSection() {
  return (
    <section
      aria-labelledby="results-heading"
      className="editorial-section assessment-section"
      id="results"
    >
      <div className="section-shell assessment-layout">
        <div>
          <p className="chapter-label">05 / Start with your building</p>
          <h2 className="display-heading" id="results-heading">
            The opportunity
            <br />
            is in the details.
          </h2>
          <p className="editorial-copy">
            Every property operates differently. A useful savings conversation
            starts with your equipment, your occupancy patterns, and your
            utility costs.
          </p>
          <a className="editorial-link" href="#contact">
            Start a Savings Review <span aria-hidden>↗</span>
          </a>
        </div>
        <dl className="assessment-rows">
          <div>
            <dt>
              <span>01</span>Understand the baseline
            </dt>
            <dd>Review how your building uses energy today.</dd>
          </div>
          <div>
            <dt>
              <span>02</span>Find controllable loads
            </dt>
            <dd>
              Identify suitable HVAC, lighting, and appliance opportunities.
            </dd>
          </div>
          <div>
            <dt>
              <span>03</span>Evaluate the investment
            </dt>
            <dd>
              Discuss project costs, applicable incentives, and how performance
              can be measured.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
