import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSection } from "@/features/home/ui/hero-section";

describe("HeroSection", () => {
  it("communicates the approved primary outcome, proof points, and ticker", () => {
    render(<HeroSection />);

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
      screen.getByRole("link", { name: "Get a Savings Analysis" }),
    ).toHaveAttribute("href", "#contact");
    expect(screen.getByLabelText("Proof ticker")).toBeInTheDocument();
  });
});
