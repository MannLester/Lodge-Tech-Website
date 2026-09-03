import type { Inquiry } from "../data/inquiry-repository";

export function summarizeInquiries(inquiries: Inquiry[]) {
  return {
    total: inquiries.length,
    open: inquiries.filter((inquiry) => inquiry.status !== "Closed").length,
    closed: inquiries.filter((inquiry) => inquiry.status === "Closed").length,
    byPropertyType: inquiries.reduce<Record<string, number>>(
      (counts, inquiry) => {
        counts[inquiry.property_type] =
          (counts[inquiry.property_type] ?? 0) + 1;
        return counts;
      },
      {},
    ),
  };
}
