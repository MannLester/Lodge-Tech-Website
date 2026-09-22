import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CompanySection } from "@/features/home/ui/company-section";

describe("CompanySection", () => {
  it("presents the concise company story and a property inquiry path", () => {
    render(<CompanySection />);

    expect(
      screen.getByRole("heading", {
        name: "Technology is only part of the story.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Let’s talk about your property/ }),
    ).toHaveAttribute("href", "#contact");
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
