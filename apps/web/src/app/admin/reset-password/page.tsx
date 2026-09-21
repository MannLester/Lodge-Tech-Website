// apps/web/app/admin/reset-password/page.tsx
import { redirect } from "next/navigation";

import { readAdminSession, ResetPasswordForm } from "@/features/admin-auth";
import { BrandMark } from "@lodging-technologies/ui/brand-mark";

export default async function ResetPasswordPage() {
  // Fetch active admin session server-side
  const session = await readAdminSession();

  // Guard: if no valid session/recovery token exists, redirect to sign-in
  if (!session) {
    redirect("/admin?auth=required");
  }

  return (
    <main className="bg-surface-muted text-foreground flex min-h-screen items-center px-4 py-10 sm:px-6">
      <section className="border-border bg-surface shadow-card mx-auto w-full max-w-md overflow-hidden rounded-lg border p-6 sm:p-8">
        <BrandMark />
        <div className="mt-8 mb-6">
          <p className="eyebrow">CRM Security</p>
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-muted mt-2 text-sm">
            Updating password for account:
          </p>
          {/* Explicitly confirm target account email */}
          <p className="text-foreground mt-1 text-sm font-semibold">
            {session.email}
          </p>
        </div>
        <ResetPasswordForm email={session.email} />
      </section>
    </main>
  );
}
