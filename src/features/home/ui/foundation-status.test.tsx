import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FoundationStatus } from "./foundation-status";

describe("FoundationStatus", () => {
  it("identifies the project and its foundation state", () => {
    render(<FoundationStatus />);

    expect(screen.getByText("Lodging Technologies")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Project foundation is ready." }),
    ).toBeInTheDocument();
  });
});
