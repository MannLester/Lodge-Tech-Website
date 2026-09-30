import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProofStats } from "@/features/home/ui/proof-stats";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function visibleValues(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll('.proof-value > span[aria-hidden="true"]'),
    (element) => element.textContent,
  );
}

describe("ProofStats", () => {
  it("counts each figure from zero when the strip enters view", () => {
    let notify: IntersectionObserverCallback = () => {};
    const observe = vi.fn();
    const disconnect = vi.fn();
    const frames: FrameRequestCallback[] = [];

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          notify = callback;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );

    const { container } = render(<ProofStats />);
    expect(visibleValues(container)).toEqual(["40+", "100,000+", "Up to 45%"]);
    expect(observe).toHaveBeenCalledOnce();

    act(() => {
      notify(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(visibleValues(container)).toEqual(["0+", "0+", "Up to 0%"]);
    expect(disconnect).toHaveBeenCalledOnce();

    act(() => frames.shift()?.(0));
    act(() => frames.shift()?.(800));
    expect(visibleValues(container)).toEqual(["35+", "87,500+", "Up to 39%"]);

    act(() => frames.shift()?.(1600));
    expect(visibleValues(container)).toEqual(["40+", "100,000+", "Up to 45%"]);
    expect(frames).toHaveLength(0);
  });

  it("keeps the final figures static for reduced motion", () => {
    const observe = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = observe;
      },
    );
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );

    const { container } = render(<ProofStats />);
    expect(visibleValues(container)).toEqual(["40+", "100,000+", "Up to 45%"]);
    expect(observe).not.toHaveBeenCalled();
  });
});
