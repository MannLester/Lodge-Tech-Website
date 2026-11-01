import "server-only";
import { z } from "zod";
import { requirePermission } from "@/features/admin-auth";
import type { Inquiry } from "@/features/inquiry";
import { getServerSupabaseClient } from "@/shared/supabase/server";
import {
  allReportIntervals,
  buildWebsiteConversionReport,
  createReportBlueprint,
} from "@/features/website-analytics/model/conversion-report";

const countsSchema = z.object({
  first_observed_at: z.string().nullable(),
  counts: z.array(
    z.object({ key: z.string(), sessions: z.number().nonnegative() }),
  ),
});
export async function loadWebsiteConversionReport(
  inquiries: Inquiry[],
  now = new Date(),
) {
  await requirePermission("reports.read");
  const blueprint = createReportBlueprint(now),
    intervals = allReportIntervals(blueprint);
  try {
    const { data, error } = await getServerSupabaseClient().rpc(
      "analytics_interval_counts",
      {
        intervals: intervals.map((i) => ({
          key: i.key,
          since_at: i.start,
          until_at: i.end,
        })),
      },
    );
    if (error) throw Error("Trend query unavailable");
    const parsed = countsSchema.parse(data);
    const first = parsed.first_observed_at
      ? Date.parse(parsed.first_observed_at)
      : null;
    const counts = new Map(parsed.counts.map((row) => [row.key, row.sessions]));
    return buildWebsiteConversionReport({
      blueprint,
      inquiries,
      now,
      sessionCounts: new Map(
        intervals.map((i) => [
          i.key,
          first !== null && Date.parse(i.end) > first
            ? (counts.get(i.key) ?? 0)
            : null,
        ]),
      ),
      availabilityMessage:
        "Sessions are recorded visits, not unique people. Earlier periods without retained analytics are unavailable. Inquiries / sessions is a volume ratio, not verified visitor conversion.",
    });
  } catch {
    return buildWebsiteConversionReport({
      blueprint,
      inquiries,
      now,
      sessionCounts: new Map(),
      availabilityMessage:
        "Session trends are temporarily unavailable. Inquiry trends remain available.",
    });
  }
}
