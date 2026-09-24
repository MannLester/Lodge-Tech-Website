import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "@/features/home/ui/site-header";

describe("SiteHeader", () => {
  afterEach(cleanup);

  it("renders the primary navigation, co-branding, and proposal action", () => {
    render(<SiteHeader />);

    expect(
      screen.getByText("GEM Link® Wireless / GEM Stat™ ET"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Request for Proposal" }),
    ).toHaveAttribute("href", "/request-for-proposal");
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

    expect(
      screen.getAllByRole("switch", { name: "Switch to night mode" }),
    ).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(
      screen.getAllByRole("link", { name: "Request for Proposal" }),
    ).toHaveLength(2);
  });

  it("uses root-qualified homepage anchors from product pages", () => {
    render(<SiteHeader fromHome={false} />);

    fireEvent.click(screen.getByText("Solutions"));
    expect(
      screen.getByRole("link", { name: "Solutions Overview" }),
    ).toHaveAttribute("href", "/#solutions");
  });
});
