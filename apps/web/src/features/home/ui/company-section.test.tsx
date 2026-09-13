import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CompanySection } from "@/features/home/ui/company-section";

describe("CompanySection", () => {
  it("presents the approved company story, mission, vision, and values", () => {
    render(<CompanySection />);

    expect(
      screen.getByRole("heading", {
        name: "Experience, technology, efficiency, and a forward-looking vision.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Mission")).toBeInTheDocument();
    expect(screen.getByText("Vision")).toBeInTheDocument();
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Sustainability")).toBeInTheDocument();
    expect(
      screen.getByAltText("Guest room in a modern lodging property"),
    ).toBeInTheDocument();
  });
});
