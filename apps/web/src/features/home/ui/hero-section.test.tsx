import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSection } from "@/features/home/ui/hero-section";

describe("HeroSection", () => {
  it("communicates the V2 primary outcome, proof points, and ticker", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", {
        name: "Reduce HVAC, Lighting, and Appliance Energy Expense 40% with GEM Link Wireless and GEM Stat ET.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("40+")).toBeInTheDocument();
    expect(screen.getByText("100,000+")).toBeInTheDocument();
    expect(screen.getAllByText("40%")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Get a Savings Analysis" }),
    ).toHaveAttribute("href", "#contact");
    expect(screen.getByLabelText("Proof ticker")).toBeInTheDocument();
  });
});
