import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
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
    ).toHaveAttribute("href", "/request-for-proposal");
    expect(screen.getByRole("link", { name: "Company" })).toHaveAttribute(
      "href",
      "/company",
    );
    const desktopNavigation = screen.getByRole("navigation", {
      name: "Primary",
    });
    const contactLink = within(desktopNavigation).getByRole("link", {
      name: "Contact Us",
    });
    expect(contactLink).toHaveAttribute("href", "#contact");
    expect(contactLink.previousElementSibling).toHaveTextContent("Company");

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

    expect(
      within(screen.getByRole("navigation", { name: "Primary" })).getByRole(
        "link",
        { name: "Contact Us" },
      ),
    ).toHaveAttribute("href", "/#contact");

    fireEvent.click(screen.getByText("Solutions"));
    expect(
      screen.getByRole("link", { name: "Solutions Overview" }),
    ).toHaveAttribute("href", "/#solutions");
  });

  it("links to the inquiry form after Company in the mobile menu", () => {
    render(<SiteHeader fromHome={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    const contactLink = within(mobileNavigation).getByRole("link", {
      name: "Contact Us",
    });
    expect(contactLink).toHaveAttribute("href", "/#contact");
    expect(contactLink.previousElementSibling).toHaveTextContent("Company");

    fireEvent.click(contactLink);
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });
});
