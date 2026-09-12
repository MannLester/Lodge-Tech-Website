import "server-only";

import { z } from "zod";

import type { Inquiry } from "@/features/inquiry";
import {
  allReportIntervals,
  buildWebsiteConversionReport,
  createReportBlueprint,
  type ReportInterval,
} from "@/features/website-analytics/model/conversion-report";

const analyticsEnvSchema = z.object({
  VERCEL_ANALYTICS_TOKEN: z.string().min(1),
  VERCEL_PROJECT_ID: z.string().min(1),
  VERCEL_TEAM_ID: z.string().min(1).optional(),
});

const countResponseSchema = z.object({
  data: z.object({
    visitors: z.number().nonnegative(),
  }),
});

type AnalyticsEnv = z.infer<typeof analyticsEnvSchema>;
type AnalyticsFetch = (
  input: string,
  init: RequestInit & { next?: { revalidate: number } },
) => Promise<Response>;

export async function fetchVisitorCount(
  interval: ReportInterval,
  env: AnalyticsEnv,
  fetcher: AnalyticsFetch = fetch,
) {
  const endInclusive = new Date(Date.parse(interval.end) - 1).toISOString();
  const search = new URLSearchParams({
    projectId: env.VERCEL_PROJECT_ID,
    since: interval.start,
    until: endInclusive,
    filter: "environment eq 'production' and requestPath eq '/'",
  });
  if (env.VERCEL_TEAM_ID) search.set("teamId", env.VERCEL_TEAM_ID);

  const response = await fetcher(
    `https://api.vercel.com/v1/query/web-analytics/visits/count?${search}`,
    {
      headers: {
        Authorization: `Bearer ${env.VERCEL_ANALYTICS_TOKEN}`,
      },
      next: { revalidate: 900 },
    },
  );

  if (!response.ok) {
    throw new Error(`Vercel Analytics returned ${response.status}`);
  }

  const parsed = countResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Vercel Analytics returned an unexpected response");
  }
  return Math.round(parsed.data.data.visitors);
}

async function fetchVisitorCounts(
  intervals: ReportInterval[],
  env: AnalyticsEnv,
  fetcher: AnalyticsFetch,
) {
  const counts = new Map<string, number | null>();
  if (intervals.length === 0) return { counts, failed: 0 };

  try {
    counts.set(
      intervals[0].key,
      await fetchVisitorCount(intervals[0], env, fetcher),
    );
  } catch {
    for (const interval of intervals) counts.set(interval.key, null);
    return { counts, failed: intervals.length };
  }

  let cursor = 1;
  let failed = 0;
  const worker = async () => {
    while (cursor < intervals.length) {
      const interval = intervals[cursor++];
      try {
        counts.set(
          interval.key,
          await fetchVisitorCount(interval, env, fetcher),
        );
      } catch {
        failed += 1;
        counts.set(interval.key, null);
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(6, intervals.length) }, () => worker()),
  );
  return { counts, failed };
}

export async function loadWebsiteConversionReport(
  inquiries: Inquiry[],
  now = new Date(),
  fetcher: AnalyticsFetch = fetch,
) {
  const blueprint = createReportBlueprint(now);
  const envResult = analyticsEnvSchema.safeParse({
    VERCEL_ANALYTICS_TOKEN: process.env.VERCEL_ANALYTICS_TOKEN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID || undefined,
  });

  if (!envResult.success) {
    return buildWebsiteConversionReport({
      availabilityMessage:
        "Visitor analytics is not configured yet. Add the Vercel Analytics token and project settings to enable conversion reporting.",
      blueprint,
      inquiries,
      now,
      visitorCounts: new Map(),
    });
  }

  const intervals = allReportIntervals(blueprint);
  const { counts, failed } = await fetchVisitorCounts(
    intervals,
    envResult.data,
    fetcher,
  );
  return buildWebsiteConversionReport({
    availabilityMessage:
      failed === 0
        ? null
        : failed === intervals.length
          ? "Vercel visitor data is temporarily unavailable. CRM inquiry reporting is still current."
          : "Some visitor periods are unavailable. Conversion rates use only periods with visitor data.",
    blueprint,
    inquiries,
    now,
    visitorCounts: counts,
  });
}
