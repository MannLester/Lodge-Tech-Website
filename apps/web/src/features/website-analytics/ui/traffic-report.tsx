"use client";
import { useEffect, useState } from "react";
import {
  campaignLink,
  platforms,
  calendarDate,
  midnight,
  shiftDate,
  reportingZone,
} from "@/features/website-analytics/model/traffic";
type Row = {
  source?: string;
  medium?: string;
  campaign?: string;
  landing_page?: string;
  sessions: number;
  duration_ms: number;
  engagement_ms: number;
};
type Report = {
  totals: {
    sessions: number;
    page_views: number;
    duration_ms: number;
    engagement_ms: number;
  };
  sources: Row[];
  landings: Row[];
  campaigns: Row[];
};
const seconds = (n: number) => `${Math.round(n / 1000)}s`;
export function TrafficReport() {
  const [days, setDays] = useState(7),
    [source, setSource] = useState(""),
    [page, setPage] = useState(0),
    [report, setReport] = useState<Report | null>(null),
    [error, setError] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  useEffect(() => {
    const c = new AbortController();
    queueMicrotask(() => {
      if (!c.signal.aborted) {
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
    void fetch(`/api/admin/analytics?${q}`, { signal: c.signal })
      .then(async (r) => {
        if (!r.ok) throw Error();
        setReport((await r.json()) as Report);
      })
      .catch(() => {
        if (!c.signal.aborted) setError(true);
      });
    return () => c.abort();
  }, [days, source, page, from, to]);
  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-xl font-bold">Website visits</h2>
      <p title="Sessions are not verified unique people. Consent choices and blocked tracking affect coverage.">
        First-party estimates · sessions, not unique people. Session duration is
        elapsed time to the last observation; engagement counts visible, focused
        viewing, not verified attention. Direct / Unknown includes unavailable
        attribution. Delivery failures can undercount.
      </p>
      <label>
        Range{" "}
        <select
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
      <label>
        {" "}
        Source{" "}
        <select
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All</option>
          <option value="__other">Other campaign/referral sources</option>
          {[
            ...platforms,
            "unknown",
            ...(report?.sources
              .map((r) => r.source!)
              .filter(
                (s) =>
                  !platforms.includes(s as (typeof platforms)[number]) &&
                  s !== "unknown",
              ) ?? []),
          ].map((s) => (
            <option key={s} value={s}>
              {s === "unknown" ? "Direct / Unknown" : s}
            </option>
          ))}
        </select>
      </label>
      {error ? (
        <p role="alert">
          Analytics unavailable. Check configuration and try again.
        </p>
      ) : !report ? (
        <p role="status">Loading analytics…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            {Object.entries({
              Sessions: report.totals.sessions,
              "Page views": report.totals.page_views,
              "Average duration": seconds(report.totals.duration_ms),
              "Average engagement": seconds(report.totals.engagement_ms),
            }).map(([k, v]) => (
              <div key={k}>
                <strong>{k}</strong>
                <p>{v}</p>
              </div>
            ))}
          </div>
          {!report.totals.sessions && (
            <p>No consented sessions in this period.</p>
          )}
          <div className="overflow-auto">
            <table className="w-full text-left">
              <caption>Acquisition sources</caption>
              <thead>
                <tr>
                  {[
                    "Source",
                    "Sessions",
                    "Share",
                    "Avg duration",
                    "Avg engagement",
                  ].map((x) => (
                    <th key={x}>{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.sources.map((r) => (
                  <tr key={r.source}>
                    <td>
                      {r.source === "unknown" ? "Direct / Unknown" : r.source}
                    </td>
                    <td>{r.sessions}</td>
                    <td>
                      {(
                        (r.sessions / (report.totals.sessions || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                    <td>{seconds(r.duration_ms)}</td>
                    <td>{seconds(r.engagement_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>Top landing pages</h3>
          {report.landings.map((r) => (
            <p key={r.landing_page}>
              {r.landing_page}: {r.sessions}
            </p>
          ))}
          <h3>Campaigns</h3>
          {report.campaigns.map((r, i) => (
            <p key={i}>
              {r.source} · {r.medium} · {r.campaign}: {r.sessions}
            </p>
          ))}
          <button disabled={!page} onClick={() => setPage(page - 1)}>
            Previous
          </button>{" "}
          <button
            disabled={report.campaigns.length < 25}
            onClick={() => setPage(page + 1)}
          >
            Next campaigns
          </button>
        </>
      )}
      <p>
        Reporting timezone: {reportingZone}. Sessions are grouped by start date,
        including their full recorded totals.
      </p>
      <label>
        From{" "}
        <input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(0);
          }}
        />
      </label>
      <label>
        Through{" "}
        <input
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(0);
          }}
        />
      </label>
      <LinkGenerator />
    </section>
  );
}
function LinkGenerator() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const [fields, setFields] = useState<Record<string, string>>({
    destination: origin,
    source: "instagram",
    medium: "social",
    campaign: "",
    content: "",
    term: "",
  });
  const [copied, setCopied] = useState(false);
  let link = "",
    error = "";
  try {
    link = campaignLink(fields.destination, origin, fields);
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <section className="mt-8 space-y-3">
      <h2 className="text-xl font-bold">UTM Link Generator</h2>
      <label>
        Preset{" "}
        <select
          onChange={(e) => setFields({ ...fields, medium: e.target.value })}
        >
          <option value="social">Social profile/post</option>
          <option value="paid_social">Paid social</option>
          <option value="cpc">Google paid search</option>
        </select>
      </label>
      {Object.keys(fields).map((key) => (
        <label className="block" key={key}>
          {key}
          <input
            className="ml-3 rounded border p-2"
            list={key === "source" ? "campaign-sources" : undefined}
            value={fields[key]}
            maxLength={key === "destination" ? 2048 : 160}
            onChange={(e) => {
              setCopied(false);
              setFields({ ...fields, [key]: e.target.value });
            }}
          />
        </label>
      ))}
      <datalist id="campaign-sources">
        {platforms.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <p>Do not include sensitive information in campaign labels.</p>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <output className="block break-all">{link}</output>
          <button
            onClick={() => {
              void navigator.clipboard
                .writeText(link)
                .then(() => setCopied(true))
                .catch(() => setCopied(false));
            }}
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </>
      )}
      <p>
        Use each generated link on its matching social profile, post,
        advertisement, or campaign. Visitors who follow the tagged link can be
        attributed to that campaign. Do not use campaign tags on internal
        website navigation.
      </p>
    </section>
  );
}
