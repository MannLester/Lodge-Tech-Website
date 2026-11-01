import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TrafficTracker } from "@/features/website-analytics/ui/traffic-tracker";
const route = vi.hoisted(() => ({ path: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.path }));
let focused = true,
  visible = "visible";
route.path = "/";
const beacon = vi.fn<(url: string, data: Blob) => boolean>(() => true);
beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  sessionStorage.clear();
  focused = true;
  visible = "visible";
  vi.spyOn(document, "hasFocus").mockImplementation(() => focused);
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => visible,
  });
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    value: beacon,
  });
  beacon.mockClear();
});
it("internal routes preserve first touch and do not duplicate unchanged paths", async () => {
  localStorage.setItem("lt.analytics.consent", "granted");
  const view = render(<TrafficTracker />);
  await act(async () => {});
  const first = JSON.parse(sessionStorage.getItem("lt.analytics.session")!);
  const initial = beacon.mock.calls.length;
  view.rerender(<TrafficTracker />);
  expect(beacon.mock.calls.length).toBe(initial);
  route.path = "/company";
  view.rerender(<TrafficTracker />);
  expect(JSON.parse(sessionStorage.getItem("lt.analytics.session")!).id).toBe(
    first.id,
  );
  expect(
    JSON.parse(sessionStorage.getItem("lt.analytics.session")!).attribution,
  ).toEqual(first.attribution);
});
it("expires after hidden inactivity without crediting the timeout", async () => {
  localStorage.setItem("lt.analytics.consent", "granted");
  render(<TrafficTracker />);
  await act(async () => {});
  const first = JSON.parse(sessionStorage.getItem("lt.analytics.session")!).id;
  act(() => vi.advanceTimersByTime(10000));
  visible = "hidden";
  focused = false;
  fireEvent(document, new Event("visibilitychange"));
  act(() => vi.advanceTimersByTime(1801000));
  visible = "visible";
  focused = true;
  fireEvent(window, new Event("focus"));
  act(() => vi.advanceTimersByTime(1000));
  expect(
    JSON.parse(sessionStorage.getItem("lt.analytics.session")!).id,
  ).not.toBe(first);
});
it("survives blocked storage and failed delivery", async () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw Error("blocked");
  });
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw Error("blocked");
  });
  beacon.mockReturnValue(false);
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(Error("offline")));
  render(<TrafficTracker />);
  await act(async () => {});
  fireEvent.click(screen.getByText("Allow analytics"));
  await act(async () => {});
  act(() => vi.advanceTimersByTime(16000));
  expect(screen.getByText("Analytics privacy settings")).toBeVisible();
  beacon.mockReturnValue(true);
  vi.unstubAllGlobals();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  Object.defineProperty(navigator, "locks", {
    configurable: true,
    value: undefined,
  });
});
it("refresh retains attribution when the previous document releases ownership", async () => {
  Object.defineProperty(navigator, "locks", {
    configurable: true,
    value: {
      request: vi.fn(
        (
          _name: string,
          options: unknown,
          callback?: (lock: unknown) => unknown,
        ) => {
          const cb = typeof options === "function" ? options : callback;
          return Promise.resolve(cb?.({}));
        },
      ),
    },
  });
  localStorage.setItem("lt.analytics.consent", "granted");
  const first = render(<TrafficTracker />);
  await act(async () => {});
  const id = JSON.parse(sessionStorage.getItem("lt.analytics.session")!).id;
  first.unmount();
  render(<TrafficTracker />);
  await act(async () => {});
  expect(JSON.parse(sessionStorage.getItem("lt.analytics.session")!).id).toBe(
    id,
  );
});
it("copied session storage rotates when another tab owns the session", async () => {
  const stored = {
    id: crypto.randomUUID(),
    start: new Date().toISOString(),
    last: Date.now(),
    landing: "/",
    attribution: {
      source: "instagram",
      medium: null,
      campaign: null,
      content: null,
      term: null,
      attribution_method: "utm",
      referrer_hostname: null,
    },
  };
  sessionStorage.setItem("lt.analytics.session", JSON.stringify(stored));
  localStorage.setItem("lt.analytics.consent", "granted");
  Object.defineProperty(navigator, "locks", {
    configurable: true,
    value: {
      request: vi.fn(
        (
          _name: string,
          options: unknown,
          callback?: (lock: unknown) => unknown,
        ) => {
          const cb = typeof options === "function" ? options : callback;
          return Promise.resolve(cb?.(null));
        },
      ),
    },
  });
  render(<TrafficTracker />);
  await act(async () => {});
  expect(
    JSON.parse(sessionStorage.getItem("lt.analytics.session")!).id,
  ).not.toBe(stored.id);
});
it("collects nothing until consent and stops on withdrawal", async () => {
  render(<TrafficTracker />);
  await act(async () => {});
  act(() => vi.advanceTimersByTime(30000));
  expect(beacon).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Allow analytics"));
  await act(async () => {});
  act(() => vi.advanceTimersByTime(20000));
  expect(beacon).toHaveBeenCalled();
  fireEvent.click(screen.getByText("Analytics privacy settings"));
  fireEvent.click(screen.getByText("Decline / withdraw"));
  const count = beacon.mock.calls.length;
  act(() => vi.advanceTimersByTime(30000));
  expect(beacon).toHaveBeenCalledTimes(count);
  expect(sessionStorage.getItem("lt.analytics.session")).toBeNull();
});
it("counts a single-page foreground visit and excludes hidden time", async () => {
  localStorage.setItem("lt.analytics.consent", "granted");
  render(<TrafficTracker />);
  await act(async () => {});
  act(() => vi.advanceTimersByTime(20000));
  visible = "hidden";
  focused = false;
  fireEvent(document, new Event("visibilitychange"));
  act(() => vi.advanceTimersByTime(40000));
  visible = "visible";
  focused = true;
  fireEvent(window, new Event("focus"));
  act(() => vi.advanceTimersByTime(11000));
  visible = "hidden";
  fireEvent(document, new Event("visibilitychange"));
  const blob = beacon.mock.calls.at(-1)?.[1] as Blob;
  expect(blob).toBeDefined();
  vi.useRealTimers();
  const payload = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsText(blob);
  });
  expect(JSON.parse(payload).engagement_time_ms).toBeGreaterThanOrEqual(29000);
  expect(JSON.parse(payload).engagement_time_ms).toBeLessThanOrEqual(31000);
});
it("BFCache restoration reuses the page view and does not add the suspension", async () => {
  localStorage.setItem("lt.analytics.consent", "granted");
  render(<TrafficTracker />);
  await act(async () => {});
  const first = beacon.mock.calls[0][1];
  act(() => vi.advanceTimersByTime(10000));
  fireEvent(window, new Event("pagehide"));
  vi.setSystemTime(Date.now() + 600000);
  fireEvent(window, new Event("pageshow"));
  act(() => vi.advanceTimersByTime(2000));
  fireEvent(window, new Event("pagehide"));
  const final = beacon.mock.calls.at(-1)![1];
  vi.useRealTimers();
  const decode = (blob: Blob) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsText(blob);
    });
  const a = JSON.parse(await decode(first)),
    b = JSON.parse(await decode(final));
  expect(b.page_view_id).toBe(a.page_view_id);
  expect(b.engagement_time_ms).toBeLessThanOrEqual(12000);
});
