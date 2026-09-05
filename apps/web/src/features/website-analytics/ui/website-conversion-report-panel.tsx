"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { useId, useState } from "react";

import type {
  ConversionPoint,
  ReportRangeKey,
  TrendValue,
  WebsiteConversionReport,
} from "@/features/website-analytics/model/conversion-report";

const rangeKeys: ReportRangeKey[] = ["daily", "weekly", "monthly"];
const chart = {
  width: 760,
  height: 320,
  left: 52,
  right: 24,
  top: 24,
  bottom: 62,
};

export function WebsiteConversionReportPanel({
  report,
}: {
  report: WebsiteConversionReport;
}) {
  const [activeRange, setActiveRange] = useState<ReportRangeKey>("daily");
  const range = report.ranges[activeRange];
  const panelId = useId();

  return (
    <section className="border-border mt-8 rounded-lg border p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="eyebrow">Website performance</p>
          <h2 className="mt-2 text-xl font-bold">Visitors and inquiries</h2>
          <p className="text-muted mt-2 max-w-2xl text-sm">
            Compare production homepage visitors with successful inquiry form
            submissions. Reporting periods use US Eastern time.
          </p>
        </div>
        <div
          aria-label="Website performance period"
          className="bg-surface-muted inline-flex w-fit rounded-md p-1"
          role="tablist"
        >
          {rangeKeys.map((key) => (
            <button
              aria-controls={`${panelId}-${key}`}
              aria-selected={activeRange === key}
              className={
                activeRange === key
                  ? "bg-surface shadow-card rounded px-3 py-2 text-sm font-bold"
                  : "text-muted hover:text-foreground rounded px-3 py-2 text-sm font-semibold"
              }
              id={`${panelId}-${key}-tab`}
              key={key}
              onClick={() => setActiveRange(key)}
              role="tab"
              type="button"
            >
              {report.ranges[key].label}
            </button>
          ))}
        </div>
      </div>

      {report.availabilityMessage ? (
        <p className="border-brand bg-brand-soft text-brand-strong mt-5 rounded-md border p-3 text-sm font-semibold">
          {report.availabilityMessage}
        </p>
      ) : null}

      <div
        aria-labelledby={`${panelId}-${activeRange}-tab`}
        className="mt-6"
        id={`${panelId}-${activeRange}`}
        role="tabpanel"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <RangeMetric
            caption={coverageCaption(
              range.availablePeriods,
              range.points.length,
            )}
            label="Visitors"
            value={formatCount(range.visitors)}
          />
          <RangeMetric
            caption={range.description}
            label="Inquiries"
            value={range.inquiries.toLocaleString()}
          />
          <RangeMetric
            caption="Inquiries ÷ visitors"
            label="Inquiry conversion"
            value={formatRate(range.conversionRate)}
          />
        </div>

        <ConversionLineChart key={activeRange} points={range.points} />
      </div>

      <div className="mt-8">
        <h3 className="text-base font-bold">Completed-period changes</h3>
        <p className="text-muted mt-1 text-sm">
          Volume changes are percentages; conversion changes are percentage
          points.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {report.comparisons.map((comparison) => (
            <article
              className="bg-surface-muted rounded-lg p-4"
              key={comparison.key}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-bold">{comparison.label}</h4>
                <span className="text-muted text-xs">{comparison.detail}</span>
              </div>
              <dl className="mt-4 grid gap-3">
                <TrendRow
                  label="Visitors"
                  trend={comparison.visitors}
                  unit="%"
                />
                <TrendRow
                  label="Inquiries"
                  trend={comparison.inquiries}
                  unit="%"
                />
                <TrendRow
                  label="Inquiry conversion"
                  trend={comparison.conversionRate}
                  unit="pp"
                />
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RangeMetric({
  caption,
  label,
  value,
}: {
  caption: string;
  label: string;
  value: string;
}) {
  return (
    <article className="bg-surface-muted rounded-lg p-4">
      <p className="text-muted text-sm font-semibold">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-muted mt-1 text-xs">{caption}</p>
    </article>
  );
}

function ConversionLineChart({ points }: { points: ConversionPoint[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const max = Math.max(
    1,
    ...points.flatMap((point) => [point.inquiries, point.visitors ?? 0]),
  );
  const x = (index: number) =>
    chart.left + (index / Math.max(points.length - 1, 1)) * plotWidth;
  const y = (value: number) => chart.top + (1 - value / max) * plotHeight;
  const active = activeIndex === null ? null : points[activeIndex];

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap gap-5 text-sm font-semibold">
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#0078a8]" /> Visitors
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#e46b2e]" /> Inquiries
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg
          aria-label="Line chart comparing website visitors and inquiry submissions"
          className="h-auto min-w-[42rem]"
          role="img"
          viewBox={`0 0 ${chart.width} ${chart.height}`}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const lineY = chart.top + ratio * plotHeight;
            const value = Math.round(max * (1 - ratio));
            return (
              <g key={ratio}>
                <line
                  stroke="var(--border)"
                  strokeWidth="1"
                  x1={chart.left}
                  x2={chart.width - chart.right}
                  y1={lineY}
                  y2={lineY}
                />
                <text
                  fill="var(--muted)"
                  fontSize="11"
                  textAnchor="end"
                  x={chart.left - 9}
                  y={lineY + 4}
                >
                  {value}
                </text>
              </g>
            );
          })}

          <path
            d={seriesPath(points, "inquiries", x, y)}
            fill="none"
            stroke="#e46b2e"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          {visitorPaths(points, x, y).map((path, index) => (
            <path
              d={path}
              fill="none"
              key={index}
              stroke="#0078a8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          ))}

          {points.map((point, index) => (
            <g key={point.key}>
              {point.visitors !== null ? (
                <circle
                  cx={x(index)}
                  cy={y(point.visitors)}
                  fill="var(--surface)"
                  r="4"
                  stroke="#0078a8"
                  strokeWidth="3"
                />
              ) : null}
              <circle
                cx={x(index)}
                cy={y(point.inquiries)}
                fill="var(--surface)"
                r="4"
                stroke="#e46b2e"
                strokeWidth="3"
              />
              <circle
                aria-label={`${point.detailLabel}: ${formatCount(
                  point.visitors,
                )} visitors, ${point.inquiries} inquiries, ${formatRate(
                  point.conversionRate,
                )} conversion`}
                cx={x(index)}
                cy={chart.top + plotHeight / 2}
                fill="transparent"
                onBlur={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onTouchStart={() => setActiveIndex(index)}
                r={Math.max(12, plotWidth / points.length / 2)}
                role="button"
                tabIndex={0}
              />
              {shouldLabel(index, points.length) ? (
                <text
                  fill="var(--muted)"
                  fontSize="10"
                  textAnchor="middle"
                  x={x(index)}
                  y={chart.height - 30}
                >
                  {point.label}
                </text>
              ) : null}
            </g>
          ))}

          {active && activeIndex !== null ? (
            <ChartTooltip point={active} x={x(activeIndex)} />
          ) : null}
        </svg>
      </div>
      <table className="sr-only">
        <caption>Website visitors and inquiry submissions by period</caption>
        <thead>
          <tr>
            <th>Period</th>
            <th>Visitors</th>
            <th>Inquiries</th>
            <th>Conversion</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.key}>
              <th>{point.detailLabel}</th>
              <td>{formatCount(point.visitors)}</td>
              <td>{point.inquiries}</td>
              <td>{formatRate(point.conversionRate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartTooltip({ point, x }: { point: ConversionPoint; x: number }) {
  const width = 184;
  const tooltipX = Math.min(
    Math.max(x - width / 2, chart.left),
    chart.width - chart.right - width,
  );
  return (
    <g pointerEvents="none">
      <rect
        fill="var(--foreground)"
        height="82"
        rx="7"
        width={width}
        x={tooltipX}
        y="8"
      />
      <text fill="var(--background)" fontSize="12" x={tooltipX + 12} y="29">
        <tspan fontWeight="700">{point.detailLabel}</tspan>
        <tspan x={tooltipX + 12} dy="20">
          Visitors: {formatCount(point.visitors)}
        </tspan>
        <tspan x={tooltipX + 12} dy="18">
          Inquiries: {point.inquiries} · {formatRate(point.conversionRate)}
        </tspan>
      </text>
    </g>
  );
}

function TrendRow({
  label,
  trend,
  unit,
}: {
  label: string;
  trend: TrendValue;
  unit: "%" | "pp";
}) {
  const Icon =
    trend.direction === "up"
      ? ArrowUpRight
      : trend.direction === "down"
        ? ArrowDownRight
        : Minus;
  const value =
    trend.direction === "new"
      ? "New"
      : trend.direction === "unavailable" || trend.value === null
        ? "—"
        : `${round(trend.value)}${unit}`;
  const color =
    trend.direction === "up" || trend.direction === "new"
      ? "text-emerald-700"
      : trend.direction === "down"
        ? "text-red-700"
        : "text-muted";
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted text-sm">{label}</dt>
      <dd
        className={`inline-flex items-center gap-1 text-sm font-bold ${color}`}
      >
        <Icon aria-hidden className="size-4" />
        {value}
      </dd>
    </div>
  );
}

function visitorPaths(
  points: ConversionPoint[],
  x: (index: number) => number,
  y: (value: number) => number,
) {
  const paths: string[] = [];
  let current: string[] = [];
  points.forEach((point, index) => {
    if (point.visitors === null) {
      if (current.length) paths.push(current.join(" "));
      current = [];
      return;
    }
    current.push(
      `${current.length ? "L" : "M"} ${x(index)} ${y(point.visitors)}`,
    );
  });
  if (current.length) paths.push(current.join(" "));
  return paths;
}

function seriesPath(
  points: ConversionPoint[],
  key: "inquiries",
  x: (index: number) => number,
  y: (value: number) => number,
) {
  return points
    .map((point, index) => `${index ? "L" : "M"} ${x(index)} ${y(point[key])}`)
    .join(" ");
}

function shouldLabel(index: number, length: number) {
  if (length <= 8) return true;
  return index === 0 || index === length - 1 || index % 2 === 0;
}

function coverageCaption(available: number, total: number) {
  return available === total
    ? `${total} reporting periods`
    : available === 0
      ? "Visitor data unavailable"
      : `${available} of ${total} periods available`;
}

function formatCount(value: number | null) {
  return value === null ? "—" : value.toLocaleString();
}

function formatRate(value: number | null) {
  return value === null ? "—" : `${round(value)}%`;
}

function round(value: number) {
  return Number(value.toFixed(1)).toLocaleString();
}
