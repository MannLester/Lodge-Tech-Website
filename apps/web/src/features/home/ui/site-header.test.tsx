import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "@/features/home/ui/site-header";

describe("SiteHeader", () => {
  afterEach(() => {
    cleanup();
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
  });

  it("renders product navigation and an accessible theme switch", () => {
    document.documentElement.dataset.theme = "light";
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: "Lodging Technologies home" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Request a Proposal" }),
    ).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Company" })).toHaveAttribute(
      "href",
      "#company",
    );

    fireEvent.click(screen.getByText("Solutions"));
    expect(screen.getByRole("link", { name: "GEM Stat ET" })).toHaveAttribute(
      "href",
      "/solutions/gem-stat-et",
    );
    expect(
      screen.getByRole("link", { name: "Lighting Controls" }),
    ).toHaveAttribute("href", "/solutions/lighting-controls");

    const themeSwitch = screen.getAllByRole("switch", {
      name: "Switch to night mode",
    })[0];
    expect(themeSwitch).toHaveAttribute("aria-checked", "false");

    fireEvent.click(themeSwitch);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(
      screen.getAllByRole("switch", { name: "Switch to day mode" })[0],
    ).toHaveAttribute("aria-checked", "true");
  });

  it("uses root-qualified homepage anchors from product pages", () => {
    render(<SiteHeader fromHome={false} />);

    fireEvent.click(screen.getByText("Solutions"));
    expect(
      screen.getByRole("link", { name: "Solutions Overview" }),
    ).toHaveAttribute("href", "/#solutions");
  });
});
