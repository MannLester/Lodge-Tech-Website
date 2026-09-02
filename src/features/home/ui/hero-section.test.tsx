import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("communicates the primary outcome and proof points", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", {
        name: "Energy wasted is money lost. We make buildings use less.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("40+")).toBeInTheDocument();
    expect(screen.getByText("100,000+")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Get a Free Savings Analysis" }),
    ).toHaveAttribute("href", "#contact");
  });
});
