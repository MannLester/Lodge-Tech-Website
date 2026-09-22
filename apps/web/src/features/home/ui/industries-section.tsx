"use client";

import Image from "next/image";
import { useState } from "react";
import hospitalityImage from "@assets/hospitality.png";
import multifamilyImage from "@assets/multifamily.png";
import seniorLivingImage from "@assets/senior_living.png";
import studentHousingImage from "@assets/student_housing.png";
import officeImage from "@assets/gem-stat-et/office-setting.jpeg";
import { industries } from "@/features/home/model/home-content";

const industryImages = [
  hospitalityImage,
  multifamilyImage,
  seniorLivingImage,
  studentHousingImage,
  officeImage,
];

export function IndustriesSection() {
  const [active, setActive] = useState(0);
  return (
    <section
      aria-labelledby="industries-heading"
      className="editorial-section industries-section"
      id="industries"
    >
      <div className="section-shell">
        <div className="section-masthead">
          <div>
            <p className="chapter-label">04 / Your kind of property</p>
            <h2 className="display-heading" id="industries-heading">
              Different buildings.
              <br />A shared opportunity.
            </h2>
          </div>
          <p className="editorial-copy">
            People come and go. Your energy strategy should account for that.
            Find an approach built around your property.
          </p>
        </div>
        <div className="industries-layout">
          <div className="industry-photo">
            <Image
              alt={industries[active].mediaLabel}
              className="object-cover"
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 92vw, 55vw"
              src={industryImages[active]}
            />
            <span className="photo-caption">{industries[active].title}</span>
          </div>
          <div className="industry-options">
            {industries.map((industry, index) => (
              <div
                className="industry-option"
                data-active={active === index}
                key={industry.title}
              >
                <h3>
                  <button
                    aria-controls={"industry-panel-" + index}
                    aria-expanded={active === index}
                    id={"industry-button-" + index}
                    onClick={() => setActive(index)}
                    type="button"
                  >
                    <span className="industry-number">0{index + 1}</span>
                    {industry.title}
                    <span aria-hidden className="industry-arrow">
                      {active === index ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  aria-labelledby={"industry-button-" + index}
                  hidden={active !== index}
                  id={"industry-panel-" + index}
                  role="region"
                >
                  <p>{industry.description}</p>
                  <a className="editorial-link" href="#contact">
                    Discuss your property <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
