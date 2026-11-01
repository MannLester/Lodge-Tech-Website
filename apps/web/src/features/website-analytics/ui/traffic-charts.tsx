"use client";
import { useId } from "react";

export type TrafficRow = {
  source?: string;
  medium?: string;
  campaign?: string;
  landing_page?: string;
  sessions: number;
  duration_ms: number;
  engagement_ms: number;
};
export const formatTime = (ms: number) =>
  ms < 60000
    ? `${Math.round(ms / 1000)}s`
    : `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
export const sourceName = (source: string) =>
  source === "unknown"
    ? "Direct / Unknown"
    : ({
        instagram: "Instagram",
        facebook: "Facebook",
        linkedin: "LinkedIn",
        google: "Google",
        tiktok: "TikTok",
      }[source] ?? source);
const colors = [
  "#0078a8",
  "#21b6d7",
  "#e46b2e",
  "#8064b4",
  "#32956f",
  "#52687d",
  "#c29b37",
];
function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border bg-surface rounded-lg border p-5 sm:p-6">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-muted mt-1 text-sm">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
export function SourceChart({
  rows,
  total,
  onSource,
}: {
  rows: TrafficRow[];
  total: number;
  onSource: (source: string) => void;
}) {
  const id = useId();
  return (
    <ChartCard
      title="Where visits came from"
      description="Share of recorded sessions by acquisition source. Select a source to filter."
    >
      <div className="grid items-center gap-5 sm:grid-cols-[minmax(10rem,13rem)_1fr]">
        <svg
          viewBox="0 0 220 220"
          className="mx-auto w-full max-w-56"
          role="img"
          aria-labelledby={id}
        >
          <title id={id}>
            Traffic source share:{" "}
            {rows
              .map((r) => `${sourceName(r.source!)} ${r.sessions} sessions`)
              .join(", ") || "No recorded sessions"}
          </title>
          <circle
            cx="110"
            cy="110"
            r="78"
            fill="none"
            stroke="var(--border)"
            strokeWidth="22"
          />
          {rows.map((r, i) => {
            const share = total ? (r.sessions / total) * 100 : 0;
            const start = total
              ? (rows.slice(0, i).reduce((sum, row) => sum + row.sessions, 0) /
                  total) *
                100
              : 0;
            return (
              <circle
                key={r.source}
                cx="110"
                cy="110"
                r="78"
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth="22"
                pathLength="100"
                strokeDasharray={`${share} ${100 - share}`}
                strokeDashoffset={-start}
                transform="rotate(-90 110 110)"
              >
                <title>
                  {sourceName(r.source!)}: {share.toFixed(1)}%
                </title>
              </circle>
            );
          })}
          <text
            x="110"
            y="108"
            textAnchor="middle"
            fill="var(--foreground)"
            fontSize="30"
            fontWeight="700"
          >
            {total.toLocaleString()}
          </text>
          <text
            x="110"
            y="132"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="12"
          >
            sessions
          </text>
        </svg>
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={r.source}>
              <button
                type="button"
                onClick={() => onSource(r.source!)}
                className="hover:bg-surface-muted flex min-h-11 w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: colors[i % colors.length] }}
                />
                <span className="min-w-0 flex-1 break-words">
                  {sourceName(r.source!)}
                </span>
                <strong>{r.sessions}</strong>
                <span className="text-muted w-14 text-right">
                  {((r.sessions / (total || 1)) * 100).toFixed(1)}%
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {!total && (
        <p className="text-muted text-center text-sm">
          Source distribution will appear after recorded visits are recorded.
        </p>
      )}
    </ChartCard>
  );
}
export function TimingChart({ rows }: { rows: TrafficRow[] }) {
  const max = Math.max(
    1,
    ...rows.flatMap((r) => [r.duration_ms, r.engagement_ms]),
  );
  return (
    <ChartCard
      title="Time spent by source"
      description="Average session duration compared with visible, focused engagement."
    >
      <div className="mb-5 flex flex-wrap gap-4 text-xs font-semibold">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#0078a8]" />
          Session duration
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#e46b2e]" />
          Foreground engagement
        </span>
      </div>
      <div
        className="space-y-5"
        role="img"
        aria-label="Average session duration and foreground engagement by source"
      >
        {rows.slice(0, 10).map((r) => (
          <div key={r.source}>
            <p className="mb-2 text-sm font-semibold">
              {sourceName(r.source!)}
            </p>
            {[
              ["Duration", r.duration_ms, "#0078a8"],
              ["Engagement", r.engagement_ms, "#e46b2e"],
            ].map(([label, value, color]) => (
              <div
                key={label}
                className="mt-1.5 grid grid-cols-[1fr_4rem] items-center gap-3"
              >
                <div className="bg-surface-muted h-3 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(Number(value) / max) * 100}%`,
                      background: String(color),
                    }}
                  />
                </div>
                <span
                  className="text-right text-xs tabular-nums"
                  aria-label={`${r.source} ${label}: ${formatTime(Number(value))}`}
                >
                  {formatTime(Number(value))}
                </span>
              </div>
            ))}
          </div>
        ))}
        {!rows.length && (
          <p className="text-muted text-sm">
            Timing comparisons will appear here once visits are measured.
          </p>
        )}
      </div>
    </ChartCard>
  );
}
export function RankingChart({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <ChartCard title={title} description={description}>
      <div className="space-y-4">
        {rows.slice(0, 10).map((r, i) => (
          <div key={`${r.label}-${i}`}>
            <div className="mb-2 flex justify-between gap-4 text-sm">
              <span className="min-w-0 break-words">{r.label}</span>
              <strong className="shrink-0 tabular-nums">{r.count}</strong>
            </div>
            <div
              role="img"
              aria-label={`${r.label}: ${r.count} sessions`}
              className="bg-surface-muted h-3 overflow-hidden rounded-full"
            >
              <div
                className="bg-brand h-full rounded-full"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {!rows.length && (
          <p className="text-muted text-sm">No recorded data in this period.</p>
        )}
      </div>
    </ChartCard>
  );
}
