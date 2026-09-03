import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
  });

  it("renders the V2 navigation, co-branding, and accessible theme switch", () => {
    document.documentElement.dataset.theme = "light";
    render(<SiteHeader />);

    expect(
      screen.getByText("GEM Link Wireless / GEM Stat ET"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Get a Savings Analysis" }),
    ).toHaveAttribute("href", "#contact");

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
});
