// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { rpc, permission } = vi.hoisted(() => ({
  rpc: vi.fn(),
  permission: vi.fn(),
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ rpc }) }));
vi.mock("@/features/admin-auth", () => ({ requirePermission: permission }));
vi.mock("@/shared/config/env/server", () => ({
  getServerEnv: () => ({
    SUPABASE_URL: "https://db.test",
    SUPABASE_SECRET_KEY: "secret",
  }),
}));
import {
  collectTraffic,
  reportTraffic,
} from "@/features/website-analytics/server/traffic";
const payload = () => ({
  session_id: crypto.randomUUID(),
  page_view_id: crypto.randomUUID(),
  started_at: new Date(Date.now() - 20000).toISOString(),
  observed_at: new Date().toISOString(),
  page_observed_at: new Date(Date.now() - 20000).toISOString(),
  landing_page: "/",
  page_path: "/",
  engagement_time_ms: 20000,
  attribution: {
    source: "tiktok",
    medium: "social",
    campaign: "test",
    content: null,
    term: null,
    attribution_method: "utm",
    referrer_hostname: null,
  },
});
const request = (p: unknown, origin = "https://site.test") =>
  new Request("https://site.test/api/analytics/collect", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
beforeEach(() => {
  vi.stubEnv("ANALYTICS_ENABLED", "true");
  vi.stubEnv("ANALYTICS_ALLOW_NONPRODUCTION", "true");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://site.test");
  rpc.mockReset();
  rpc.mockResolvedValue({ data: { totals: { sessions: 1 } }, error: null });
  permission.mockReset();
  permission.mockResolvedValue({ role: "ADMIN" });
});
it("collects valid guest snapshots without auth", async () => {
  expect((await collectTraffic(request(payload()))).status).toBe(204);
  expect(permission).not.toHaveBeenCalled();
  expect(rpc).toHaveBeenCalledWith(
    "collect_analytics",
    expect.objectContaining({
      p: expect.objectContaining({
        attribution: expect.objectContaining({ source: "tiktok" }),
      }),
    }),
  );
});
it("rejects origin spoof and malformed/sensitive payloads", async () => {
  expect(
    (await collectTraffic(request(payload(), "https://evil.test"))).status,
  ).toBe(403);
  expect(
    (await collectTraffic(request({ ...payload(), page_path: "/admin" })))
      .status,
  ).toBe(400);
  expect(
    (await collectTraffic(request({ ...payload(), email: "private" }))).status,
  ).toBe(400);
  expect(rpc).not.toHaveBeenCalled();
});
it("limits body size and observed time rather than receipt time", async () => {
  expect((await collectTraffic(request({ x: "x".repeat(9000) }))).status).toBe(
    413,
  );
  expect(
    (
      await collectTraffic(
        request({
          ...payload(),
          observed_at: new Date(Date.now() + 3600000).toISOString(),
        }),
      )
    ).status,
  ).toBe(400);
});
it("disabled collection never writes", async () => {
  vi.stubEnv("ANALYTICS_ENABLED", "false");
  expect((await collectTraffic(request(payload()))).status).toBe(204);
  expect(rpc).not.toHaveBeenCalled();
});
it("authorizes reporting at the endpoint", async () => {
  permission.mockRejectedValue(Error("Forbidden"));
  expect(
    (await reportTraffic(new Request("https://site.test/api/admin/analytics")))
      .status,
  ).toBe(403);
  expect(rpc).not.toHaveBeenCalled();
});
it("passes bounded filters to server aggregation", async () => {
  const result = await reportTraffic(
    new Request(
      "https://site.test/api/admin/analytics?since=2026-10-01&until=2026-11-01&source=tiktok&page=2",
    ),
  );
  expect(result.status).toBe(200);
  expect(rpc).toHaveBeenCalledWith(
    "analytics_report",
    expect.objectContaining({ source_filter: "tiktok", page_number: 2 }),
  );
  expect(permission).toHaveBeenCalledWith("reports.read");
});
