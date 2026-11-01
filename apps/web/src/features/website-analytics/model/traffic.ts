import { z } from "zod";

export const platforms = [
  "instagram",
  "facebook",
  "linkedin",
  "google",
  "tiktok",
] as const;
export const domains: Record<string, string[]> = {
  instagram: ["instagram.com", "l.instagram.com"],
  facebook: ["facebook.com", "fb.com", "fb.me"],
  linkedin: ["linkedin.com", "lnkd.in"],
  google: ["google.com", "google.co.uk", "google.ca"],
  tiktok: ["tiktok.com"],
};
export const normalize = (s: string) =>
  s.trim().replace(/\s+/g, " ").toLowerCase();
const label = z
  .string()
  .trim()
  .max(160)
  .refine((s) => !/[\x00-\x1f\x7f]/.test(s));
export const publicPaths = [
  "/",
  "/company",
  "/request-for-proposal",
  "/results",
  ...[
    "gem-stat-et",
    "gem-link-wireless",
    "lighting-controls",
    "appliance-controls",
  ].map((s) => `/solutions/${s}`),
];
export const pathSchema = z.enum(publicPaths as [string, ...string[]]);
export const attributionSchema = z
  .object({
    source: label.min(1),
    medium: label.nullable(),
    campaign: label.nullable(),
    content: label.nullable(),
    term: label.nullable(),
    attribution_method: z.enum(["utm", "referrer", "unknown"]),
    referrer_hostname: z
      .string()
      .max(253)
      .regex(/^[a-z0-9.-]+$/)
      .nullable(),
  })
  .strict();
export function attribution(
  url: URL,
  referrer: string,
  ownHosts: string[],
  mapping = domains,
) {
  const params = url.searchParams;
  const value = (key: string) => {
    const v = label.safeParse(params.get(key) ?? "");
    return v.success && v.data ? v.data : null;
  };
  const campaign = {
    medium: value("utm_medium"),
    campaign: value("utm_campaign"),
    content: value("utm_content"),
    term: value("utm_term"),
  };
  const source = value("utm_source");
  if (source)
    return {
      ...campaign,
      source: normalize(source),
      attribution_method: "utm" as const,
      referrer_hostname: null,
    };
  try {
    const ref = new URL(referrer);
    const host = ref.hostname.toLowerCase().replace(/\.$/, "");
    if (
      ["http:", "https:"].includes(ref.protocol) &&
      !ownHosts.includes(host) &&
      /^[a-z0-9.-]+$/.test(host)
    ) {
      const platform = Object.entries(mapping).find(([, ds]) =>
        ds.some((d) => host === d || host.endsWith(`.${d}`)),
      )?.[0];
      return {
        ...campaign,
        source: platform ?? host,
        attribution_method: "referrer" as const,
        referrer_hostname: host,
      };
    }
  } catch {
    /* Missing or unusable acquisition referrer. */
  }
  return {
    ...campaign,
    source: "unknown",
    attribution_method: "unknown" as const,
    referrer_hostname: null,
  };
}
export const snapshotSchema = z
  .object({
    session_id: z.uuid(),
    page_view_id: z.uuid(),
    started_at: z.iso.datetime(),
    observed_at: z.iso.datetime(),
    page_observed_at: z.iso.datetime(),
    landing_page: pathSchema,
    page_path: pathSchema,
    engagement_time_ms: z.number().int().min(0).max(86400000),
    attribution: attributionSchema,
  })
  .strict();
export type Snapshot = z.infer<typeof snapshotSchema>;
export function campaignLink(
  destination: string,
  origin: string,
  fields: Record<string, string>,
) {
  const url = new URL(destination);
  if (
    url.origin !== new URL(origin).origin ||
    url.username ||
    url.password ||
    !["https:", "http:"].includes(url.protocol)
  )
    throw new Error("Choose a destination on the configured public website.");
  for (const key of ["source", "medium", "campaign", "content", "term"]) {
    const parsed = label.parse(fields[key] ?? "");
    url.searchParams.delete(`utm_${key}`);
    if (parsed)
      url.searchParams.set(
        `utm_${key}`,
        ["source", "medium"].includes(key) ? normalize(parsed) : parsed,
      );
  }
  if (!url.searchParams.get("utm_source"))
    throw new Error("Source is required.");
  return url.toString();
}
export function engagementDelta(elapsed: number, eligible: boolean) {
  return eligible && elapsed >= 0 && elapsed <= 5000 ? elapsed : 0;
}
export const reportingZone =
  process.env.NEXT_PUBLIC_ANALYTICS_TIME_ZONE ?? "America/New_York";
export function calendarDate(instant: Date, zone = reportingZone) {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const value = (name: string) => p.find((v) => v.type === name)!.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}
export function midnight(date: string, zone = reportingZone) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw Error("Invalid date");
  const base = Date.parse(`${date}T00:00:00Z`);
  if (
    !Number.isFinite(base) ||
    new Date(base).toISOString().slice(0, 10) !== date
  )
    throw Error("Invalid date");
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  let instant = base;
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(
      fmt.formatToParts(new Date(instant)).map((v) => [v.type, v.value]),
    );
    const represented = Date.UTC(
      +p.year,
      +p.month - 1,
      +p.day,
      +p.hour,
      +p.minute,
      +p.second,
    );
    instant += base - represented;
  }
  return new Date(instant).toISOString();
}
export function shiftDate(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000)
    .toISOString()
    .slice(0, 10);
}
