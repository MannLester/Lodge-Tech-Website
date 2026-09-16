import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadAdminAccount } from "@/features/admin-account";
import {
  AdminSignIn,
  can,
  loadAdminAccessUsers,
  loadAdminAuditLogs,
  readAdminAuthErrorReason,
  readAdminSession,
} from "@/features/admin-auth";
import { AdminDashboardPlaceholder } from "@/features/admin-dashboard";
import { loadAdminFollowUps, loadAdminInquiries } from "@/features/inquiry";
import { loadWebsiteConversionReport } from "@/features/website-analytics";

import type { InquiryStatus } from "@/features/inquiry";

type View =
  "account" | "dashboard" | "leads" | "tasks" | "reports" | "access" | "audit";

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
    account_status?: string;
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
  const requestedView: View = [
    "account",
    "dashboard",
    "leads",
    "tasks",
    "reports",
    "access",
    "audit",
  ].includes(params.view ?? "")
    ? (params.view as View)
    : "dashboard";
  const view =
    requestedView === "reports" && !can(session.role, "reports.read")
      ? "dashboard"
      : requestedView === "access" && !can(session.role, "access.manage")
        ? "dashboard"
        : requestedView === "audit" && !can(session.role, "audit.read")
          ? "dashboard"
          : requestedView;
  const [accountResult, inquiryResult, followUpResult] = await Promise.all([
    loadAdminAccount(session.email),
    loadAdminInquiries(),
    loadAdminFollowUps(),
  ]);
  const websiteConversionReport =
    view === "reports" && inquiryResult.ok
      ? await loadWebsiteConversionReport(inquiryResult.inquiries)
      : null;

  return (
    <AdminDashboardPlaceholder
      accountResult={accountResult}
      accountStatus={params.account_status}
      filters={{
        propertyType: params.property,
        query: params.q,
        status: params.status as InquiryStatus | undefined,
      }}
      accessResult={view === "access" ? await loadAdminAccessUsers() : null}
      auditResult={view === "audit" ? await loadAdminAuditLogs() : null}
      inquiryResult={inquiryResult}
      followUpResult={followUpResult}
      session={session}
      view={view}
      websiteConversionReport={websiteConversionReport}
    />
  );
}
