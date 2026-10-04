import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { EcosystemMap } from "@/features/solutions/ui/ecosystem-map";

describe("EcosystemMap", () => {
  afterEach(cleanup);

  it("shows the documented signal, control, and load path", () => {
    render(<EcosystemMap currentSlug="gem-stat-et" />);

    const diagram = screen.getByRole("group", {
      name: "Connected solution diagram",
    });

    expect(within(diagram).getByText("PIR occupancy sensor")).toBeVisible();
    expect(
      within(diagram).getByText("Entry and balcony contacts"),
    ).toBeVisible();
    expect(within(diagram).getByText("Control layer")).toBeVisible();
    expect(within(diagram).getByText("Managed loads")).toBeVisible();
    expect(within(diagram).getByText("HVAC")).toBeVisible();
  });

  it("starts on the current solution and exposes every product route", () => {
    render(<EcosystemMap currentSlug="gem-stat-et" />);

    const thermostat = screen.getByRole("button", { name: /GEM Stat™ ET/ });
    expect(thermostat).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("You are viewing this solution.")).toBeVisible();

    const lighting = screen.getByRole("button", {
      name: /GEM Link® Wireless – Lighting Control/,
    });
    fireEvent.click(lighting);

    expect(lighting).toHaveAttribute("aria-pressed", "true");
    expect(thermostat).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("link", {
        name: /Explore GEM Link® Wireless – Lighting Control/,
      }),
    ).toHaveAttribute("href", "/solutions/lighting-controls");
  });
});
