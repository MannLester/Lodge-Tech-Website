import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  afterEach(() => {
    cleanup();
    document.documentElement.dataset.theme = "light";
    window.localStorage.clear();
  });

  it("switches and persists the selected theme", () => {
    document.documentElement.dataset.theme = "light";
    render(<ThemeToggle />);

    fireEvent.click(
      screen.getByRole("switch", { name: "Switch to night mode" }),
    );

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(
      screen.getByRole("switch", { name: "Switch to day mode" }),
    ).toHaveAttribute("aria-checked", "true");
  });
});
