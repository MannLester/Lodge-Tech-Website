import { LogOut, ShieldCheck } from "lucide-react";

import type { AdminSession } from "@/features/admin-auth/model/admin-session-token";
import { logoutAdmin } from "@/features/admin-auth/server/actions";
import { BrandMark } from "@/shared/ui/brand-mark";

type AdminDashboardPlaceholderProps = Readonly<{
  session: AdminSession;
}>;

export function AdminDashboardPlaceholder({
  session,
}: AdminDashboardPlaceholderProps) {
  const expiresAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(session.expiresAt));

  return (
    <main className="bg-surface-muted text-foreground min-h-screen">
      <header className="border-border bg-surface border-b">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl flex-col justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <BrandMark />
          <form action={logoutAdmin}>
            <button
              className="border-border bg-surface text-foreground hover:border-brand hover:text-brand focus-visible:outline-brand inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-bold transition"
              type="submit"
            >
              <LogOut aria-hidden="true" className="size-4" />
              Logout
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[17rem_1fr] lg:px-8">
        <aside className="border-border bg-surface rounded-lg border p-4">
          <nav aria-label="Admin workspace" className="grid gap-1">
            {["Dashboard", "Inquiries", "Follow-ups", "Reports"].map(
              (item, index) => (
                <span
                  aria-current={index === 0 ? "page" : undefined}
                  className={
                    index === 0
                      ? "bg-brand-soft text-brand-strong rounded-md px-3 py-2 text-sm font-bold"
                      : "text-muted rounded-md px-3 py-2 text-sm font-semibold"
                  }
                  key={item}
                >
                  {item}
                </span>
              ),
            )}
          </nav>
        </aside>

        <div className="grid gap-6">
          <section className="border-border bg-surface shadow-card rounded-lg border p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="eyebrow">Light CRM</p>
                <h1 className="mt-2 text-3xl leading-tight font-bold md:text-4xl">
                  Admin dashboard
                </h1>
                <p className="text-muted mt-3 max-w-2xl text-sm leading-6">
                  Demo admin access is active. The CRM shell and inquiry
                  workflow will build on this authenticated route.
                </p>
              </div>
              <div className="border-border bg-surface-muted text-brand-strong inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold">
                <ShieldCheck aria-hidden="true" className="size-4" />
                {session.sub}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["New inquiries", "0", "Awaiting CRM workspace"],
              ["Contacted", "0", "Status changes come next"],
              ["Closed", "0", "Reporting is deferred"],
            ].map(([label, value, note]) => (
              <article
                className="border-border bg-surface rounded-lg border p-5"
                key={label}
              >
                <p className="text-muted text-sm font-semibold">{label}</p>
                <p className="mt-3 text-3xl font-bold">{value}</p>
                <p className="text-muted mt-2 text-sm">{note}</p>
              </article>
            ))}
          </section>

          <section className="border-border bg-surface rounded-lg border border-dashed p-6">
            <h2 className="text-lg font-bold">Session details</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted font-semibold">Role</dt>
                <dd className="mt-1 font-bold">{session.role}</dd>
              </div>
              <div>
                <dt className="text-muted font-semibold">Mode</dt>
                <dd className="mt-1 font-bold">{session.authMode}</dd>
              </div>
              <div>
                <dt className="text-muted font-semibold">Expires</dt>
                <dd className="mt-1 font-bold">{expiresAt}</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
}
