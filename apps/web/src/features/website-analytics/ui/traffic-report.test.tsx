import {
  cleanup,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { TrafficReport } from "@/features/website-analytics/ui/traffic-report";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it("renders real aggregate metrics and filters server requests", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      totals: {
        sessions: 4,
        page_views: 10,
        duration_ms: 70000,
        engagement_ms: 30000,
      },
      sources: [
        {
          source: "tiktok",
          sessions: 3,
          duration_ms: 70000,
          engagement_ms: 30000,
        },
      ],
      landings: [],
      campaigns: [],
    }),
  });
  vi.stubGlobal("fetch", fetcher);
  render(<TrafficReport />);
  await screen.findByText("75.0%");
  expect(screen.getAllByText("30s")).toHaveLength(2);
  fireEvent.change(screen.getByLabelText(/Source/), {
    target: { value: "tiktok" },
  });
  await waitFor(() =>
    expect(fetcher.mock.calls.at(-1)?.[0]).toContain("source=tiktok"),
  );
});
it("shows an error when reporting is unavailable", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  render(<TrafficReport />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Analytics unavailable",
  );
});
it("generates a preview using configured origin", async () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://site.test");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  render(<TrafficReport />);
  fireEvent.change(screen.getByLabelText("campaign"), {
    target: { value: "Summer sale" },
  });
  expect(screen.getByText(/utm_campaign=Summer\+sale/)).toBeVisible();
  await screen.findByRole("alert");
});
