// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createReportBlueprint } from "@/features/website-analytics/model/conversion-report";
import {
  fetchVisitorCount,
  loadWebsiteConversionReport,
} from "@/features/website-analytics/server/load-conversion-report";

afterEach(() => vi.unstubAllEnvs());

describe("Vercel visitor analytics", () => {
  it("requests production homepage visitors using an inclusive end timestamp", async () => {
    const interval = createReportBlueprint(
      new Date("2026-03-09T16:00:00Z"),
    ).ranges.daily.at(-1)!;
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        Response.json({ data: { pageviews: 35, visitors: 24 } }),
      );

    await expect(
      fetchVisitorCount(
        interval,
        {
          VERCEL_ANALYTICS_TOKEN: "secret-token",
          VERCEL_PROJECT_ID: "prj_example",
          VERCEL_TEAM_ID: "team_example",
        },
        fetcher,
      ),
    ).resolves.toBe(24);

    const [url, options] = fetcher.mock.calls[0];
    const request = new URL(url);
    expect(request.pathname).toBe("/v1/query/web-analytics/visits/count");
    expect(request.searchParams.get("since")).toBe("2026-03-09T04:00:00.000Z");
    expect(request.searchParams.get("until")).toBe("2026-03-10T03:59:59.999Z");
    expect(request.searchParams.get("filter")).toBe(
      "environment eq 'production' and requestPath eq '/'",
    );
    expect(options).toMatchObject({
      headers: { Authorization: "Bearer secret-token" },
      next: { revalidate: 900 },
    });
  });

  it("rejects malformed analytics responses", async () => {
    const interval = createReportBlueprint().ranges.daily[0];
    const fetcher = vi.fn().mockResolvedValue(Response.json({ data: {} }));
    await expect(
      fetchVisitorCount(
        {
          ...interval,
        },
        {
          VERCEL_ANALYTICS_TOKEN: "secret-token",
          VERCEL_PROJECT_ID: "prj_example",
        },
        fetcher,
      ),
    ).rejects.toThrow("unexpected response");
  });

  it("keeps inquiry reporting available when analytics is not configured", async () => {
    vi.stubEnv("VERCEL_ANALYTICS_TOKEN", "");
    vi.stubEnv("VERCEL_PROJECT_ID", "");
    vi.stubEnv("VERCEL_TEAM_ID", "");
    const fetcher = vi.fn();

    const report = await loadWebsiteConversionReport(
      [],
      new Date("2026-03-09T16:00:00Z"),
      fetcher,
    );

    expect(fetcher).not.toHaveBeenCalled();
    expect(report.availability).toBe("unavailable");
    expect(report.availabilityMessage).toContain("not configured");
  });
});
