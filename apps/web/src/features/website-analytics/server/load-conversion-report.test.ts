// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { rpc, permission } = vi.hoisted(() => ({
  rpc: vi.fn(),
  permission: vi.fn(),
}));
vi.mock("@/features/admin-auth", () => ({ requirePermission: permission }));
vi.mock("@/shared/supabase/server", () => ({
  getServerSupabaseClient: () => ({ rpc }),
}));
import { loadWebsiteConversionReport } from "@/features/website-analytics/server/load-conversion-report";
beforeEach(() => {
  rpc.mockReset();
  permission.mockReset();
  permission.mockResolvedValue({ role: "ADMIN" });
});
it("requires reporting permission before querying trends", async () => {
  permission.mockRejectedValue(Error("Forbidden"));
  await expect(loadWebsiteConversionReport([])).rejects.toThrow("Forbidden");
  expect(rpc).not.toHaveBeenCalled();
});
it("loads all trend periods in one aggregate query and excludes unknown history", async () => {
  rpc.mockImplementation(async (_name, { intervals }) => ({
    data: {
      first_observed_at: "2026-11-01T10:00:00Z",
      counts: intervals.map((i: { key: string }) => ({
        key: i.key,
        sessions: 3,
      })),
    },
    error: null,
  }));
  const report = await loadWebsiteConversionReport(
    [],
    new Date("2026-11-01T16:00:00Z"),
  );
  expect(rpc).toHaveBeenCalledTimes(1);
  expect(report.ranges.daily.points.at(-1)?.sessions).toBe(3);
  expect(report.ranges.daily.points[0].sessions).toBeNull();
  expect(report.comparisons[0].sessions.direction).toBe("unavailable");
});
it("keeps the inquiry chart available if session aggregation fails", async () => {
  rpc.mockResolvedValue({ error: { message: "unavailable" } });
  const report = await loadWebsiteConversionReport([]);
  expect(report.availability).toBe("unavailable");
  expect(report.availabilityMessage).toContain(
    "Inquiry trends remain available",
  );
});
