import "server-only";
import { requirePermission } from "@/features/admin-auth";
import { getServerSupabaseClient } from "@/shared/supabase/server";
import {
  snapshotSchema,
  normalize,
} from "@/features/website-analytics/model/traffic";
const db = getServerSupabaseClient;
const reply = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function collectTraffic(request: Request) {
  if (
    process.env.ANALYTICS_ENABLED !== "true" ||
    (process.env.NODE_ENV !== "production" &&
      process.env.ANALYTICS_ALLOW_NONPRODUCTION !== "true") ||
    (process.env.VERCEL_ENV &&
      process.env.VERCEL_ENV !== "production" &&
      process.env.ANALYTICS_ALLOW_NONPRODUCTION !== "true")
  )
    return new Response(null, { status: 204 });
  if (
    request.headers.get("origin") !==
    new URL(process.env.NEXT_PUBLIC_SITE_URL!).origin
  )
    return reply({}, 403);
  if (
    /bot|crawler|spider|headless/i.test(request.headers.get("user-agent") ?? "")
  )
    return new Response(null, { status: 204 });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({}, 415);
  try {
    const reader = request.body?.getReader();
    let text = "";
    let size = 0;
    const decoder = new TextDecoder();
    if (reader)
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > 8192) {
          await reader.cancel();
          return reply({}, 413);
        }
        text += decoder.decode(chunk.value, { stream: true });
      }
    text += decoder.decode();
    const p = snapshotSchema.parse(JSON.parse(text));
    p.attribution.source = normalize(p.attribution.source);
    if (p.attribution.medium)
      p.attribution.medium = normalize(p.attribution.medium);
    const now = Date.now();
    const start = Date.parse(p.started_at),
      observed = Date.parse(p.observed_at),
      page = Date.parse(p.page_observed_at);
    if (
      start > page ||
      page > observed ||
      observed > now + 5000 ||
      observed < now - 86400000 ||
      start < now - 90 * 86400000 ||
      p.engagement_time_ms > observed - page + 1000
    )
      return reply({}, 400);
    const { error } = await db().rpc("collect_analytics", { p });
    if (error) return reply({}, 503);
    return new Response(null, { status: 204 });
  } catch {
    return reply({}, 400);
  }
}
export async function reportTraffic(request: Request) {
  try {
    await requirePermission("reports.read");
  } catch {
    return reply({}, 403);
  }
  const q = new URL(request.url).searchParams;
  if ((q.get("source")?.length ?? 0) > 160) return reply({}, 400);
  const end = new Date(q.get("until") ?? Date.now());
  const start = new Date(q.get("since") ?? end.getTime() - 7 * 86400000);
  if (
    !Number.isFinite(+start) ||
    !Number.isFinite(+end) ||
    +end <= +start ||
    +end - +start > 366 * 86400000
  )
    return reply({}, 400);
  const page = Number(q.get("page") ?? 0);
  if (!Number.isInteger(page) || page < 0 || page > 10000)
    return reply({}, 400);
  const { data, error } = await db().rpc("analytics_report", {
    since_at: start.toISOString(),
    until_at: end.toISOString(),
    source_filter: q.get("source") || null,
    page_number: page,
  });
  return error ? reply({}, 503) : reply(data);
}
export async function cleanupTraffic(request: Request) {
  const secret = process.env.ANALYTICS_CLEANUP_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return reply({}, 403);
  const { error } = await db().rpc("cleanup_analytics", {
    retention_days: Number(process.env.ANALYTICS_RETENTION_DAYS ?? 90),
  });
  return reply({ ok: !error }, error ? 503 : 200);
}
