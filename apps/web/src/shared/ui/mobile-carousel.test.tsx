import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MobileCarousel } from "@/shared/ui/mobile-carousel";

function mockMediaQueries({ reducedMotion = false } = {}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(
      (query: string) =>
        ({
          addEventListener: vi.fn(),
          matches: query.includes("max-width") || reducedMotion,
          media: query,
          onchange: null,
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    ),
  );
}

function renderCarousel() {
  const view = render(
    <MobileCarousel ariaLabel="Test items" intervalMs={1000}>
      <article>First</article>
      <article>Second</article>
      <article>Third</article>
    </MobileCarousel>,
  );
  const track = view.container.querySelector(".snap-row") as HTMLDivElement;
  const items = [...track.children] as HTMLElement[];

  items.forEach((item, index) => {
    Object.defineProperty(item, "offsetLeft", {
      configurable: true,
      value: index * 300,
    });
  });
  track.scrollTo = vi.fn();

  return { track };
}

describe("MobileCarousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("advances automatically and supports manual navigation", async () => {
    mockMediaQueries();
    const { track } = renderCarousel();

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(track.scrollTo).toHaveBeenCalledWith({
      behavior: "smooth",
      left: 300,
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Next item in Test items" }),
    );
    expect(track.scrollTo).toHaveBeenLastCalledWith({
      behavior: "smooth",
      left: 600,
    });
  });

  it("does not autoplay when reduced motion is requested", async () => {
    mockMediaQueries({ reducedMotion: true });
    const { track } = renderCarousel();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(track.scrollTo).not.toHaveBeenCalled();
  });
});
