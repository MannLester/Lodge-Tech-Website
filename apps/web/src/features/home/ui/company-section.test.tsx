import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CompanySection } from "@/features/home/ui/company-section";

describe("CompanySection", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("presents the concise company story and a route to the full profile", () => {
    render(<CompanySection />);

    expect(
      screen.getByRole("heading", {
        name: "Technology is only part of the story.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Know more about the company/ }),
    ).toHaveAttribute("href", "/company");
    expect(
      screen.getByAltText(
        "Lodging Technologies branded modern building exterior",
      ),
    ).toBeInTheDocument();
  });

  it("moves through the four supplied Company images", () => {
    const { container } = render(<CompanySection />);
    const gallery = within(container);

    fireEvent.click(
      gallery.getByRole("button", { name: "Next company image" }),
    );
    expect(
      gallery.getByRole("img", {
        name: "Lodging Technologies branded tree scene with two control devices",
      }),
    ).toBeInTheDocument();
    expect(gallery.getByTestId("company-gallery")).toHaveAttribute(
      "data-active-slide",
      "Tree scene",
    );

    fireEvent.click(
      gallery.getByRole("button", { name: "Show Guest room image" }),
    );
    expect(
      gallery.getByRole("img", {
        name: "Lodging Technologies branded guest room with wall-mounted controls",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      gallery.getByRole("button", { name: "Next company image" }),
    );
    expect(
      gallery.getByRole("img", {
        name: "Lodging Technologies branded group of thermostat and control devices on green plinths",
      }),
    ).toBeInTheDocument();
  });

  it("advances automatically and pauses while the gallery is hovered", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    const { container } = render(<CompanySection />);
    const gallery = within(container).getByTestId("company-gallery");

    await act(async () => vi.advanceTimersByTime(3000));
    expect(gallery).toHaveAttribute("data-active-slide", "Tree scene");

    fireEvent.mouseEnter(gallery);
    await act(async () => vi.advanceTimersByTime(6000));
    expect(gallery).toHaveAttribute("data-active-slide", "Tree scene");

    fireEvent.mouseLeave(gallery);
    await act(async () => vi.advanceTimersByTime(3000));
    expect(gallery).toHaveAttribute("data-active-slide", "Guest room");
  });

  it("keeps the gallery still when reduced motion is requested", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    const { container } = render(<CompanySection />);
    const gallery = within(container).getByTestId("company-gallery");

    await act(async () => vi.advanceTimersByTime(6000));
    expect(gallery).toHaveAttribute("data-active-slide", "Building");
  });
});
