import type { Inquiry } from "@/features/inquiry";

export const REPORT_TIME_ZONE = "America/New_York";

export type ReportRangeKey = "daily" | "weekly" | "monthly";

export type ReportInterval = {
  key: string;
  label: string;
  detailLabel: string;
  start: string;
  end: string;
};

export type ConversionPoint = ReportInterval & {
  visitors: number | null;
  inquiries: number;
  conversionRate: number | null;
};

export type ConversionRange = {
  label: string;
  description: string;
  points: ConversionPoint[];
  visitors: number | null;
  inquiries: number;
  conversionRate: number | null;
  availablePeriods: number;
};

export type TrendValue = {
  direction: "up" | "down" | "flat" | "new" | "unavailable";
  value: number | null;
};

export type PeriodComparison = {
  key: "yesterday" | "last-week" | "last-month";
  label: string;
  detail: string;
  visitors: TrendValue;
  inquiries: TrendValue;
  conversionRate: TrendValue;
  currentConversionRate: number | null;
};

export type WebsiteConversionReport = {
  availability: "available" | "partial" | "unavailable";
  availabilityMessage: string | null;
  generatedAt: string;
  timeZone: string;
  ranges: Record<ReportRangeKey, ConversionRange>;
  comparisons: PeriodComparison[];
};

type CalendarDate = { year: number; month: number; day: number };

type ReportBlueprint = {
  ranges: Record<ReportRangeKey, ReportInterval[]>;
  comparisons: {
    key: PeriodComparison["key"];
    label: string;
    detail: string;
    current: ReportInterval;
    previous: ReportInterval;
  }[];
};

const rangeLabels: Record<
  ReportRangeKey,
  Pick<ConversionRange, "label" | "description">
> = {
  daily: { label: "Daily", description: "Last 14 days" },
  weekly: { label: "Weekly", description: "Last 12 weeks" },
  monthly: { label: "Monthly", description: "Last 12 months" },
};

const datePartsFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  timeZone: REPORT_TIME_ZONE,
  year: "numeric",
});

const shortDayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  weekday: "short",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

function calendarDateAt(instant: Date): CalendarDate {
  const parts = Object.fromEntries(
    datePartsFormatter
      .formatToParts(instant)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  return { year: parts.year, month: parts.month, day: parts.day };
}

function calendarDateAsUtc(date: CalendarDate) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

function addDays(date: CalendarDate, amount: number): CalendarDate {
  const next = calendarDateAsUtc(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
}

function addMonths(date: CalendarDate, amount: number): CalendarDate {
  const next = new Date(Date.UTC(date.year, date.month - 1 + amount, 1));
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: 1,
  };
}

function startOfWeek(date: CalendarDate) {
  const weekday = calendarDateAsUtc(date).getUTCDay();
  return addDays(date, -(weekday === 0 ? 6 : weekday - 1));
}

function zoneOffsetAt(instant: Date) {
  const parts = Object.fromEntries(
    datePartsFormatter
      .formatToParts(instant)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return representedAsUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

export function easternMidnight(date: CalendarDate) {
  const guess = Date.UTC(date.year, date.month - 1, date.day);
  const firstPass = guess - zoneOffsetAt(new Date(guess));
  const resolved = guess - zoneOffsetAt(new Date(firstPass));
  return new Date(resolved);
}

function dateKey(date: CalendarDate) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(
    date.day,
  ).padStart(2, "0")}`;
}

function formatCalendarDate(
  date: CalendarDate,
  formatter: Intl.DateTimeFormat,
) {
  return formatter.format(calendarDateAsUtc(date));
}

function interval(
  start: CalendarDate,
  end: CalendarDate,
  label: string,
  detailLabel: string,
): ReportInterval {
  return {
    key: `${dateKey(start)}/${dateKey(end)}`,
    label,
    detailLabel,
    start: easternMidnight(start).toISOString(),
    end: easternMidnight(end).toISOString(),
  };
}

function dayInterval(date: CalendarDate) {
  return interval(
    date,
    addDays(date, 1),
    formatCalendarDate(date, shortDayFormatter),
    formatCalendarDate(date, weekdayFormatter),
  );
}

function weekInterval(date: CalendarDate) {
  const end = addDays(date, 7);
  const inclusiveEnd = addDays(end, -1);
  return interval(
    date,
    end,
    formatCalendarDate(date, shortDayFormatter),
    `${formatCalendarDate(date, shortDayFormatter)}–${formatCalendarDate(
      inclusiveEnd,
      shortDayFormatter,
    )}`,
  );
}

function monthInterval(date: CalendarDate) {
  const start = { ...date, day: 1 };
  return interval(
    start,
    addMonths(start, 1),
    formatCalendarDate(start, monthFormatter),
    formatCalendarDate(start, monthFormatter),
  );
}

export function createReportBlueprint(now = new Date()): ReportBlueprint {
  const today = calendarDateAt(now);
  const thisWeek = startOfWeek(today);
  const thisMonth = { ...today, day: 1 };
  const yesterday = addDays(today, -1);
  const lastWeek = addDays(thisWeek, -7);
  const lastMonth = addMonths(thisMonth, -1);

  return {
    ranges: {
      daily: Array.from({ length: 14 }, (_, index) =>
        dayInterval(addDays(today, index - 13)),
      ),
      weekly: Array.from({ length: 12 }, (_, index) =>
        weekInterval(addDays(thisWeek, (index - 11) * 7)),
      ),
      monthly: Array.from({ length: 12 }, (_, index) =>
        monthInterval(addMonths(thisMonth, index - 11)),
      ),
    },
    comparisons: [
      {
        key: "yesterday",
        label: "Yesterday",
        detail: "vs. day before",
        current: dayInterval(yesterday),
        previous: dayInterval(addDays(yesterday, -1)),
      },
      {
        key: "last-week",
        label: "Last week",
        detail: "vs. previous week",
        current: weekInterval(lastWeek),
        previous: weekInterval(addDays(lastWeek, -7)),
      },
      {
        key: "last-month",
        label: "Last month",
        detail: "vs. previous month",
        current: monthInterval(lastMonth),
        previous: monthInterval(addMonths(lastMonth, -1)),
      },
    ],
  };
}

function inquiriesIn(interval: ReportInterval, inquiries: Inquiry[]) {
  const start = Date.parse(interval.start);
  const end = Date.parse(interval.end);
  return inquiries.filter((inquiry) => {
    const createdAt = Date.parse(inquiry.created_at);
    return createdAt >= start && createdAt < end;
  }).length;
}

export function conversionRate(inquiries: number, visitors: number | null) {
  return visitors === null || visitors === 0
    ? null
    : (inquiries / visitors) * 100;
}

export function percentageChange(
  current: number,
  previous: number,
): TrendValue {
  if (previous === 0) {
    return current === 0
      ? { direction: "flat", value: 0 }
      : { direction: "new", value: null };
  }
  const value = ((current - previous) / previous) * 100;
  return {
    direction: value > 0 ? "up" : value < 0 ? "down" : "flat",
    value: Math.abs(value),
  };
}

function pointChange(
  current: number | null,
  previous: number | null,
): TrendValue {
  if (current === null || previous === null)
    return { direction: "unavailable", value: null };
  const value = current - previous;
  return {
    direction: value > 0 ? "up" : value < 0 ? "down" : "flat",
    value: Math.abs(value),
  };
}

function makePoint(
  blueprint: ReportInterval,
  inquiries: Inquiry[],
  visitorCounts: ReadonlyMap<string, number | null>,
): ConversionPoint {
  const inquiryCount = inquiriesIn(blueprint, inquiries);
  const visitors = visitorCounts.get(blueprint.key) ?? null;
  return {
    ...blueprint,
    inquiries: inquiryCount,
    visitors,
    conversionRate: conversionRate(inquiryCount, visitors),
  };
}

export function buildWebsiteConversionReport({
  availabilityMessage = null,
  blueprint,
  inquiries,
  now = new Date(),
  visitorCounts,
}: {
  availabilityMessage?: string | null;
  blueprint: ReportBlueprint;
  inquiries: Inquiry[];
  now?: Date;
  visitorCounts: ReadonlyMap<string, number | null>;
}): WebsiteConversionReport {
  const ranges = Object.fromEntries(
    (Object.keys(blueprint.ranges) as ReportRangeKey[]).map((key) => {
      const points = blueprint.ranges[key].map((item) =>
        makePoint(item, inquiries, visitorCounts),
      );
      const available = points.filter((point) => point.visitors !== null);
      const visitors = available.length
        ? available.reduce((sum, point) => sum + (point.visitors ?? 0), 0)
        : null;
      const coveredInquiries = available.reduce(
        (sum, point) => sum + point.inquiries,
        0,
      );
      return [
        key,
        {
          ...rangeLabels[key],
          points,
          visitors,
          inquiries: points.reduce((sum, point) => sum + point.inquiries, 0),
          conversionRate: conversionRate(coveredInquiries, visitors),
          availablePeriods: available.length,
        },
      ];
    }),
  ) as WebsiteConversionReport["ranges"];

  const comparisons = blueprint.comparisons.map((comparison) => {
    const current = makePoint(comparison.current, inquiries, visitorCounts);
    const previous = makePoint(comparison.previous, inquiries, visitorCounts);
    return {
      key: comparison.key,
      label: comparison.label,
      detail: comparison.detail,
      visitors:
        current.visitors === null || previous.visitors === null
          ? { direction: "unavailable" as const, value: null }
          : percentageChange(current.visitors, previous.visitors),
      inquiries: percentageChange(current.inquiries, previous.inquiries),
      conversionRate: pointChange(
        current.conversionRate,
        previous.conversionRate,
      ),
      currentConversionRate: current.conversionRate,
    };
  });

  const allPoints = Object.values(ranges).flatMap((range) => range.points);
  const availableCount = allPoints.filter(
    (point) => point.visitors !== null,
  ).length;
  const availability =
    availableCount === 0
      ? "unavailable"
      : availableCount === allPoints.length
        ? "available"
        : "partial";

  return {
    availability,
    availabilityMessage,
    generatedAt: now.toISOString(),
    timeZone: REPORT_TIME_ZONE,
    ranges,
    comparisons,
  };
}

export function allReportIntervals(blueprint: ReportBlueprint) {
  const intervals = [
    ...Object.values(blueprint.ranges).flat(),
    ...blueprint.comparisons.flatMap((item) => [item.current, item.previous]),
  ];
  return [...new Map(intervals.map((item) => [item.key, item])).values()];
}
