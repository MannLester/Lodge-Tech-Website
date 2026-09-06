import { notFound } from "next/navigation";

import { AdminSignIn, readAdminSession } from "@/features/admin-auth";
import { AdminLeadWorkspace } from "@/features/admin-dashboard";
import { loadAdminLead } from "@/features/inquiry";

export default async function AdminLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readAdminSession();
  if (!session) return <AdminSignIn />;

  const { id } = await params;
  const result = await loadAdminLead(id);
  if (!result.ok && result.notFound) notFound();

  return <AdminLeadWorkspace result={result} session={session} />;
}
