import type { FollowUp } from "@/features/inquiry/data/follow-up-repository";
import type {
  Inquiry,
  InquiryStatus,
} from "@/features/inquiry/data/inquiry-repository";

export const selectableLeadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Won",
  "Lost",
] as const satisfies readonly InquiryStatus[];

export const reportLeadStatuses = [
  ...selectableLeadStatuses,
  "Closed",
] as const satisfies readonly InquiryStatus[];

export type LeadFilters = {
  propertyType?: string;
  query?: string;
  status?: InquiryStatus;
};

export function filterInquiries(inquiries: Inquiry[], filters: LeadFilters) {
  const query = filters.query?.trim().toLocaleLowerCase();
  return inquiries.filter((inquiry) => {
    const matchesQuery =
      !query ||
      [inquiry.name, inquiry.company, inquiry.email, inquiry.phone ?? ""].some(
        (value) => value.toLocaleLowerCase().includes(query),
      );
    return (
      matchesQuery &&
      (!filters.status || inquiry.status === filters.status) &&
      (!filters.propertyType || inquiry.property_type === filters.propertyType)
    );
  });
}

export function groupFollowUps(followUps: FollowUp[], today: string) {
  return {
    overdue: followUps.filter(
      (item) => !item.completed_at && item.due_at && item.due_at < today,
    ),
    today: followUps.filter(
      (item) => !item.completed_at && item.due_at === today,
    ),
    upcoming: followUps.filter(
      (item) => !item.completed_at && item.due_at && item.due_at > today,
    ),
    unscheduled: followUps.filter((item) => !item.completed_at && !item.due_at),
    completed: followUps.filter((item) => Boolean(item.completed_at)),
  };
}

export function summarizeInquiries(inquiries: Inquiry[], now = new Date()) {
  const byPropertyType = inquiries.reduce<Record<string, number>>(
    (counts, inquiry) => {
      counts[inquiry.property_type] = (counts[inquiry.property_type] ?? 0) + 1;
      return counts;
    },
    {},
  );
  const byStatus = Object.fromEntries(
    reportLeadStatuses.map((status) => [
      status,
      inquiries.filter((inquiry) => inquiry.status === status).length,
    ]),
  ) as Record<InquiryStatus, number>;
  const decided = byStatus.Won + byStatus.Lost;
  const months = Array.from({ length: 6 }, (_, offset) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - offset), 1),
    );
    return {
      key: date.toISOString().slice(0, 7),
      label: new Intl.DateTimeFormat("en", {
        month: "short",
        timeZone: "UTC",
        year: "2-digit",
      }).format(date),
      count: 0,
    };
  });
  for (const inquiry of inquiries) {
    const month = months.find(
      (candidate) => candidate.key === inquiry.created_at.slice(0, 7),
    );
    if (month) month.count += 1;
  }

  return {
    total: inquiries.length,
    open: byStatus.New + byStatus.Contacted + byStatus.Qualified,
    won: byStatus.Won,
    lost: byStatus.Lost,
    legacyClosed: byStatus.Closed,
    conversionRate: decided === 0 ? null : (byStatus.Won / decided) * 100,
    byPropertyType,
    byStatus,
    months,
  };
}
