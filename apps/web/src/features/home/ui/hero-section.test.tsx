import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSection } from "@/features/home/ui/hero-section";

describe("HeroSection", () => {
  it("communicates the approved primary outcome, proof points, and proposal action", () => {
    const { container } = render(<HeroSection />);

    expect(
      screen.getByRole("heading", {
        name: "Save energy without sacrificing comfort.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("40+")).toBeInTheDocument();
    expect(screen.getByText("100,000+")).toBeInTheDocument();
    expect(screen.getByText("Up to 45%")).toBeInTheDocument();
    expect(
      screen.getByText("Reduction in HVAC Operating Time"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Request a Proposal / Site Survey" }),
    ).toHaveAttribute("href", "/request-for-proposal");
    expect(
      screen.getByLabelText("Experience and performance"),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-hero-layer="day"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-hero-layer="night"]'),
    ).toBeInTheDocument();
  });
});
