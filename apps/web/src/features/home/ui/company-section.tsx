import { CompanyImageSlider } from "@/features/home/ui/company-image-slider";

export function CompanySection() {
  return (
    <section
      aria-labelledby="company-heading"
      className="editorial-section company-section"
      id="company"
    >
      <div className="section-shell company-layout">
        <CompanyImageSlider />
        <div>
          <p className="chapter-label">06 / Lodging Technologies</p>
          <h2 className="display-heading" id="company-heading">
            Technology is only <br />
            part of the story.
          </h2>
          <p className="company-lead">
            The people behind it make the difference.
          </p>
          <p className="editorial-copy">
            We bring together energy management, building controls, and
            practical property experience. Our focus is straightforward: reduce
            unnecessary consumption while respecting the people who use your
            spaces.
          </p>
          <p className="editorial-copy">
            From the first operating review to installation and ongoing support,
            we help connect the technology to the needs of your building.
          </p>
          <a className="editorial-link" href="#contact">
            Let’s talk about your property <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
