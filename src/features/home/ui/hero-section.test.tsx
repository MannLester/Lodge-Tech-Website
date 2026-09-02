import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
  });

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

  it("integrates the accessible day and night control with the hero layers", () => {
    document.documentElement.dataset.theme = "light";
    const { container } = render(<HeroSection />);

    expect(container.querySelector('[data-hero-layer="night"]')).toBeTruthy();

    const hero = within(container);
    const nightModeButton = hero.getByRole("button", {
      name: "Switch to night mode",
    });
    fireEvent.click(nightModeButton);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(
      hero.getByRole("button", { name: "Switch to day mode" }),
    ).toBeInTheDocument();
  });
});
