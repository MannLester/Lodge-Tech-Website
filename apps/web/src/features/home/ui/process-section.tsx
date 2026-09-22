import { turnkeySteps } from "@/features/home/model/home-content";

export function ProcessSection() {
  return (
    <section
      aria-labelledby="process-heading"
      className="editorial-section process-section"
    >
      <div className="section-shell">
        <div className="section-masthead">
          <div>
            <p className="chapter-label">
              07 / From possibility to performance
            </p>
            <h2 className="display-heading" id="process-heading">
              A clear path forward.
              <br />
              <span className="muted-heading">One accountable team.</span>
            </h2>
          </div>
          <p className="editorial-copy">
            A considered process, from understanding your property to supporting
            the controls that keep it running.
          </p>
        </div>
        <ol className="process-timeline">
          {turnkeySteps.map((step, index) => (
            <li key={step.title}>
              <span className="process-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
