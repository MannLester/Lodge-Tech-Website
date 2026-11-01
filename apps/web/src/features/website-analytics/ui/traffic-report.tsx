"use client";
import { useEffect, useState } from "react";
import { Clock3, Eye, MousePointer2, Users } from "lucide-react";
import {
  platforms,
  calendarDate,
  midnight,
  shiftDate,
  reportingZone,
} from "@/features/website-analytics/model/traffic";
import {
  SourceChart,
  TimingChart,
  RankingChart,
  formatTime,
  sourceName,
  type TrafficRow,
} from "@/features/website-analytics/ui/traffic-charts";
import { LinkGenerator } from "@/features/website-analytics/ui/utm-link-generator";
type Report = {
  totals: {
    sessions: number;
    page_views: number;
    duration_ms: number;
    engagement_ms: number;
  };
  sources: TrafficRow[];
  landings: TrafficRow[];
  campaigns: TrafficRow[];
};
const fieldClass =
  "border-border bg-surface text-foreground min-h-11 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-brand";
export function TrafficReport() {
  const [days, setDays] = useState(7),
    [source, setSource] = useState(""),
    [page, setPage] = useState(0),
    [report, setReport] = useState<Report | null>(null),
    [error, setError] = useState(false),
    [from, setFrom] = useState(""),
    [to, setTo] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        setReport(null);
        setError(false);
      }
    });
    const today = calendarDate(new Date());
    let since: string, until: string;
    try {
      since = midnight(from || shiftDate(today, 1 - days));
      until = midnight(shiftDate(to || today, 1));
    } catch {
      queueMicrotask(() => setError(true));
      return;
    }
    const q = new URLSearchParams({ since, until, source, page: String(page) });
    void fetch(`/api/admin/analytics?${q}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw Error();
        const data = (await response.json()) as Report;
        if (!controller.signal.aborted) setReport(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [days, source, page, from, to]);
  const setSourceFilter = (value: string) => {
    setSource(value);
    setPage(0);
  };
  return (
    <section className="mt-8 space-y-6" aria-label="Website traffic analytics">
      <div className="border-border bg-surface rounded-lg border p-5 sm:p-6">
        <p className="eyebrow">Acquisition & engagement</p>
        <h2 className="mt-2 text-xl font-bold">Website visits</h2>
        <p className="text-muted mt-2 max-w-3xl text-sm">
          See where visits come from and how long people view the website. These
          charts use consented sessions, not verified unique people.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5 text-xs font-semibold">
            Range
            <select
              className={fieldClass}
              value={days}
              onChange={(e) => {
                setDays(Number(e.target.value));
                setFrom("");
                setTo("");
                setPage(0);
              }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold">
            Source
            <select
              className={fieldClass}
              value={source}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">All sources</option>
              <option value="__other">Other campaign/referral sources</option>
              {[
                ...new Set([
                  ...platforms,
                  "unknown",
                  ...(source && source !== "__other" ? [source] : []),
                  ...(report?.sources.map((r) => r.source!) ?? []),
                ]),
              ].map((s) => (
                <option key={s} value={s}>
                  {sourceName(s)}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold">
            From
            <input
              className={fieldClass}
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(0);
              }}
            />
          </label>
          <label className="space-y-1.5 text-xs font-semibold">
            Through
            <input
              className={fieldClass}
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(0);
              }}
            />
          </label>
        </div>
        <p className="text-muted mt-3 text-xs">
          Filters apply to the charts below. Calendar dates use {reportingZone}.
        </p>
      </div>
      {error ? (
        <div
          role="alert"
          className="border-border bg-surface rounded-lg border p-6"
        >
          <p className="font-bold">Analytics unavailable</p>
          <p className="text-muted mt-2 text-sm">
            Check configuration and try again. Existing inquiry reports remain
            available.
          </p>
        </div>
      ) : !report ? (
        <div
          role="status"
          className="border-border grid gap-4 rounded-lg border p-6 sm:grid-cols-4"
        >
          <span className="sr-only">Loading analytics…</span>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface-muted h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Sessions",
                value: report.totals.sessions.toLocaleString(),
                caption: "Consented website visits",
                icon: Users,
              },
              {
                label: "Page views",
                value: report.totals.page_views.toLocaleString(),
                caption: "Across public website pages",
                icon: Eye,
              },
              {
                label: "Average duration",
                value: formatTime(report.totals.duration_ms),
                caption: "Start to last observed activity",
                icon: Clock3,
              },
              {
                label: "Average engagement",
                value: formatTime(report.totals.engagement_ms),
                caption: "Visible and focused viewing",
                icon: MousePointer2,
              },
            ].map((metric) => (
              <article
                className="border-border bg-surface rounded-lg border p-5"
                key={metric.label}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-muted text-sm font-semibold">
                    {metric.label}
                  </p>
                  <metric.icon
                    className="text-brand-strong size-5"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-3xl font-bold tabular-nums">
                  {metric.value}
                </p>
                <p className="text-muted mt-2 text-xs">{metric.caption}</p>
              </article>
            ))}
          </div>
          {!report.totals.sessions && (
            <p className="border-border bg-surface-muted rounded-lg border p-4 text-sm">
              No consented sessions in this period. Charts will fill as visitors
              opt in.
            </p>
          )}
          <div className="grid gap-6 xl:grid-cols-2">
            <SourceChart
              rows={report.sources}
              total={report.totals.sessions}
              onSource={setSourceFilter}
            />
            <TimingChart rows={report.sources} />
            <RankingChart
              title="Top landing pages"
              description="The first page viewed in each session."
              rows={report.landings.map((r) => ({
                label: r.landing_page!,
                count: r.sessions,
              }))}
            />
            <RankingChart
              title="Campaign performance"
              description="Sessions attributed to your tagged campaign links."
              rows={report.campaigns.map((r) => ({
                label: `${r.campaign} · ${sourceName(r.source!)}${r.medium ? ` · ${r.medium}` : ""}`,
                count: r.sessions,
              }))}
            />
          </div>
          {report.campaigns.length > 0 && (
            <div className="flex items-center justify-end gap-3 text-sm">
              <button
                className="border-border min-h-10 rounded-md border px-4 font-semibold disabled:opacity-40"
                disabled={!page}
                onClick={() => setPage(page - 1)}
              >
                Previous campaigns
              </button>
              <button
                className="border-border min-h-10 rounded-md border px-4 font-semibold disabled:opacity-40"
                disabled={report.campaigns.length < 25}
                onClick={() => setPage(page + 1)}
              >
                Next campaigns
              </button>
            </div>
          )}
          <details className="border-border bg-surface rounded-lg border p-5">
            <summary className="cursor-pointer text-sm font-semibold">
              View detailed source metrics
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[35rem] text-left text-sm">
                <caption className="sr-only">Acquisition sources</caption>
                <thead className="text-muted border-border border-b">
                  <tr>
                    {[
                      "Source",
                      "Sessions",
                      "Share",
                      "Avg duration",
                      "Avg engagement",
                    ].map((label) => (
                      <th className="px-3 py-3 font-semibold" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.sources.map((r) => (
                    <tr
                      className="border-border border-b last:border-0"
                      key={r.source}
                    >
                      <td className="px-3 py-3">{sourceName(r.source!)}</td>
                      <td className="px-3 py-3">{r.sessions}</td>
                      <td className="px-3 py-3">
                        {(
                          (r.sessions / (report.totals.sessions || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </td>
                      <td className="px-3 py-3">{formatTime(r.duration_ms)}</td>
                      <td className="px-3 py-3">
                        {formatTime(r.engagement_ms)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
      <p className="text-muted max-w-4xl text-xs leading-5">
        Duration and engagement are estimates. Engagement measures visible,
        focused viewing, not verified attention. Direct / Unknown includes
        unavailable attribution. Consent, blocking and failed delivery affect
        coverage. Sessions are grouped by start date, including their full
        recorded totals.
      </p>
      <LinkGenerator />
    </section>
  );
}
