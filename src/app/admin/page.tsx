import type { Metadata } from "next";

import { readAdminSession } from "@/features/admin-auth/server/session";
import { AdminDashboardPlaceholder } from "@/features/admin-auth/ui/admin-dashboard-placeholder";
import { AdminSignIn } from "@/features/admin-auth/ui/admin-sign-in";
import { loadAdminInquiries } from "@/features/inquiry/server/admin-inquiries";

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
      session={session}
      view={view}
    />
  );
}
