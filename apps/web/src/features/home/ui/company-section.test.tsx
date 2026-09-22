import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CompanySection } from "@/features/home/ui/company-section";

describe("CompanySection", () => {
  it("presents the approved company story, mission, vision, and values", () => {
    const { container } = render(<CompanySection />);

    expect(
      screen.getByRole("heading", {
        name: "Experience, technology, efficiency, and a forward-looking vision.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Mission")).toBeInTheDocument();
    expect(screen.getByText("Vision")).toBeInTheDocument();
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Sustainability")).toBeInTheDocument();
    const values = container.querySelector("[data-company-values]");
    expect(values).toHaveClass("mt-10");
    expect(values?.querySelector("li")).toHaveClass("text-base", "lg:text-lg");
    expect(
      screen.getByAltText(
        "Lodging Technologies branded modern building exterior",
      ),
    ).toBeInTheDocument();
  });

  it("moves through the four supplied Company images", () => {
    const { container } = render(<CompanySection />);
    const gallery = within(container);

    fireEvent.click(
      gallery.getByRole("button", { name: "Next company image" }),
    );
    expect(
      gallery.getByRole("img", {
        name: "Lodging Technologies branded tree scene with two control devices",
      }),
    ).toBeInTheDocument();
    expect(gallery.getByTestId("company-gallery")).toHaveAttribute(
      "data-active-slide",
      "Tree scene",
    );

    fireEvent.click(
      gallery.getByRole("button", { name: "Show Guest room image" }),
    );
    expect(
      gallery.getByRole("img", {
        name: "Lodging Technologies branded guest room with wall-mounted controls",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      gallery.getByRole("button", { name: "Next company image" }),
    );
    expect(
      gallery.getByRole("img", {
        name: "Lodging Technologies branded group of thermostat and control devices on green plinths",
      }),
    ).toBeInTheDocument();
  });
});
