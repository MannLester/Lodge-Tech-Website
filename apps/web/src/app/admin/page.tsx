import type { Metadata } from "next";

import { AdminSignIn, readAdminSession } from "@/features/admin-auth";
import { AdminDashboardPlaceholder } from "@/features/admin-dashboard";
import { loadAdminFollowUps, loadAdminInquiries } from "@/features/inquiry";

type View = "dashboard" | "inquiries" | "follow-ups" | "reports";

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
  searchParams: Promise<{ view?: string }>;
}) {
  const session = await readAdminSession();

  if (!session) {
    return <AdminSignIn />;
  }

  const params = await searchParams;
  const view: View = [
    "dashboard",
    "inquiries",
    "follow-ups",
    "reports",
  ].includes(params.view ?? "")
    ? (params.view as View)
    : "dashboard";

  return (
    <AdminDashboardPlaceholder
      inquiryResult={await loadAdminInquiries()}
      followUpResult={await loadAdminFollowUps()}
      session={session}
      view={view}
    />
  );
}
