import { describe, expect, it } from "vitest";
import {
  attribution,
  campaignLink,
  engagementDelta,
  midnight,
  platforms,
  snapshotSchema,
} from "@/features/website-analytics/model/traffic";
describe("first-party analytics", () => {
  it.each(platforms)(
    "normalizes %s and prioritizes UTM over referrer",
    (source) => {
      expect(
        attribution(
          new URL(
            `https://site.test/?utm_source=%20${source.toUpperCase()}%20`,
          ),
          "https://facebook.com/post",
          ["site.test"],
        ),
      ).toMatchObject({ source, attribution_method: "utm" });
    },
  );
  it.each(platforms)("recognizes %s subdomains", (source) =>
    expect(
      attribution(
        new URL("https://site.test/"),
        `https://www.${source}.com/private?q=secret`,
        ["site.test"],
      ),
    ).toMatchObject({
      source,
      referrer_hostname: `www.${source}.com`,
      attribution_method: "referrer",
    }),
  );
  it("rejects lookalike classification", () =>
    expect(
      attribution(
        new URL("https://site.test/"),
        "https://facebook.com.evil.test/",
        [],
      ).source,
    ).toBe("facebook.com.evil.test"));
  it("ignores own host and missing attribution", () => {
    for (const ref of ["", "https://site.test/x", "invalid"]) {
      expect(
        attribution(new URL("https://site.test/"), ref, ["site.test"]),
      ).toMatchObject({ source: "unknown", attribution_method: "unknown" });
    }
  });
  it("retains custom campaign labels without inventing medium", () =>
    expect(
      attribution(
        new URL(
          "https://site.test/?utm_source=Trade%20Show&utm_campaign=Summer",
        ),
        "",
        [],
      ),
    ).toMatchObject({
      source: "trade show",
      medium: null,
      campaign: "Summer",
    }));
  it("counts 20 foreground, 40 hidden, 10 foreground as 30 seconds", () => {
    const ms = [
      ...Array(20).fill(true),
      ...Array(40).fill(false),
      ...Array(10).fill(true),
    ].reduce((n, v) => n + engagementDelta(1000, v), 0);
    expect(ms).toBe(30000);
    expect(engagementDelta(60000, true)).toBe(0);
  });
  it("preserves query and fragment, replaces UTM, encodes labels", () => {
    const url = new URL(
      campaignLink(
        "https://site.test/path?x=1&utm_source=old&utm_source=duplicate#section",
        "https://site.test",
        {
          source: " TikTok ",
          medium: " PAID_SOCIAL ",
          campaign: "Summer & winter",
        },
      ),
    );
    expect(url.searchParams.getAll("utm_source")).toEqual(["tiktok"]);
    expect(url.searchParams.get("utm_campaign")).toBe("Summer & winter");
    expect(url.searchParams.get("x")).toBe("1");
    expect(url.hash).toBe("#section");
  });
  it("rejects external and credential destinations", () => {
    for (const u of [
      "https://evil.test/",
      "javascript:alert(1)",
      "https://user:pass@site.test/",
    ]) {
      expect(() =>
        campaignLink(u, "https://site.test", { source: "google" }),
      ).toThrow();
    }
  });
  it("resolves timezone dates through DST", () => {
    expect(midnight("2026-03-08")).toBe("2026-03-08T05:00:00.000Z");
    expect(midnight("2026-03-09")).toBe("2026-03-09T04:00:00.000Z");
  });
  it("rejects private routes and invalid identifiers", () =>
    expect(
      snapshotSchema.safeParse({
        session_id: "account@email.test",
        page_path: "/admin",
      }).success,
    ).toBe(false));
});
