import type { Metadata } from "next";

import { readAdminSession } from "@/features/admin-auth/server/session";
import { AdminDashboardPlaceholder } from "@/features/admin-auth/ui/admin-dashboard-placeholder";
import { AdminSignIn } from "@/features/admin-auth/ui/admin-sign-in";

export const metadata: Metadata = {
  title: "Admin | Lodge Tech",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await readAdminSession();

  if (!session) {
    return <AdminSignIn />;
  }

  return <AdminDashboardPlaceholder session={session} />;
}
