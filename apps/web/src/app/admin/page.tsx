import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  AdminSignIn,
  readAdminAuthErrorReason,
  readAdminSession,
} from "@/features/admin-auth";
import { AdminDashboardPlaceholder } from "@/features/admin-dashboard";
import { loadAdminFollowUps, loadAdminInquiries } from "@/features/inquiry";
import { loadWebsiteConversionReport } from "@/features/website-analytics";

import type { InquiryStatus } from "@/features/inquiry";

type View = "dashboard" | "leads" | "tasks" | "reports";

export const metadata: Metadata = {
  title: "Admin | Lodge Tech",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    property?: string;
    q?: string;
    status?: string;
    view?: string;
    auth?: string;
    reason?: string;
  }>;
}) {
  const session = await readAdminSession();
  const params = await searchParams;

  if (!session) {
    return (
      <AdminSignIn
        denied={params.auth === "denied"}
        errorReason={
          params.auth === "error"
            ? readAdminAuthErrorReason(params.reason)
            : null
        }
      />
    );
  }

  if (params.view === "inquiries") redirect("/admin?view=leads");
  if (params.view === "follow-ups") redirect("/admin?view=tasks");
  const view: View = ["dashboard", "leads", "tasks", "reports"].includes(
    params.view ?? "",
  )
    ? (params.view as View)
    : "dashboard";
  const [inquiryResult, followUpResult] = await Promise.all([
    loadAdminInquiries(),
    loadAdminFollowUps(),
  ]);
  const websiteConversionReport =
    view === "reports" && inquiryResult.ok
      ? await loadWebsiteConversionReport(inquiryResult.inquiries)
      : null;

  return (
    <AdminDashboardPlaceholder
      filters={{
        propertyType: params.property,
        query: params.q,
        status: params.status as InquiryStatus | undefined,
      }}
      inquiryResult={inquiryResult}
      followUpResult={followUpResult}
      session={session}
      view={view}
      websiteConversionReport={websiteConversionReport}
    />
  );
}
