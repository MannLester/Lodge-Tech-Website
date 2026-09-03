import { Inbox, LogOut, ShieldCheck } from "lucide-react";

import type { AdminSession } from "@/features/admin-auth/model/admin-session-token";
import { logoutAdmin } from "@/features/admin-auth/server/actions";
import type { InquiryStatus } from "@/features/inquiry/data/inquiry-repository";
import { updateInquiryStatus } from "@/features/inquiry/server/admin-actions";
import type { AdminInquiryResult } from "@/features/inquiry/server/admin-inquiries";
import { BrandMark } from "@/shared/ui/brand-mark";

type View = "dashboard" | "inquiries" | "follow-ups" | "reports";
type Props = Readonly<{
  session: AdminSession;
  view: View;
  inquiryResult: AdminInquiryResult;
}>;
const navItems: { label: string; view: View }[] = [
  { label: "Dashboard", view: "dashboard" },
  { label: "Inquiries", view: "inquiries" },
  { label: "Follow-ups", view: "follow-ups" },
  { label: "Reports", view: "reports" },
];
const statuses: InquiryStatus[] = ["New", "Contacted", "Closed"];

export function AdminDashboardPlaceholder({
  session,
  view,
  inquiryResult,
}: Props) {
  const inquiries = inquiryResult.ok ? inquiryResult.inquiries : [];
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
              className="border-border bg-surface hover:border-brand hover:text-brand inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-bold transition"
              type="submit"
            >
              <LogOut aria-hidden="true" className="size-4" /> Logout
            </button>
          </form>
        </div>
      </header>
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[17rem_1fr] lg:px-8">
        <aside className="border-border bg-surface rounded-lg border p-4">
          <nav aria-label="Admin workspace" className="grid gap-1">
            {navItems.map((item) => (
              <a
                aria-current={item.view === view ? "page" : undefined}
                className={
                  item.view === view
                    ? "bg-brand-soft text-brand-strong rounded-md px-3 py-2 text-sm font-bold"
                    : "text-muted hover:text-brand rounded-md px-3 py-2 text-sm font-semibold"
                }
                href={`/admin?view=${item.view}`}
                key={item.view}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <div className="grid gap-6">
          {view === "dashboard" && (
            <>
              <section className="border-border bg-surface shadow-card rounded-lg border p-6">
                <p className="eyebrow">Light CRM</p>
                <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-3xl leading-tight font-bold md:text-4xl">
                      Admin dashboard
                    </h1>
                    <p className="text-muted mt-3 max-w-2xl text-sm leading-6">
                      Review incoming savings-analysis inquiries and move them
                      through your follow-up workflow.
                    </p>
                  </div>
                  <div className="border-border bg-surface-muted text-brand-strong inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold">
                    <ShieldCheck aria-hidden="true" className="size-4" />
                    {session.sub}
                  </div>
                </div>
              </section>
              <section className="grid gap-4 md:grid-cols-3">
                {statuses.map((status) => (
                  <article
                    className="border-border bg-surface rounded-lg border p-5"
                    key={status}
                  >
                    <p className="text-muted text-sm font-semibold">
                      {status === "New" ? "New inquiries" : status}
                    </p>
                    <p className="mt-3 text-3xl font-bold">
                      {inquiryResult.ok
                        ? inquiries.filter(
                            (inquiry) => inquiry.status === status,
                          ).length
                        : "-"}
                    </p>
                    <p className="text-muted mt-2 text-sm">
                      {inquiryResult.ok
                        ? "Live from Supabase"
                        : "Database unavailable"}
                    </p>
                  </article>
                ))}
              </section>
            </>
          )}
          {view === "inquiries" && <InquiryList result={inquiryResult} />}
          {(view === "follow-ups" || view === "reports") && (
            <section className="border-border bg-surface rounded-lg border p-6">
              <p className="eyebrow">Light CRM</p>
              <h1 className="mt-2 text-2xl font-bold">
                {view === "follow-ups" ? "Follow-ups" : "Reports"}
              </h1>
              <p className="text-muted mt-3 text-sm">
                This workspace is ready for the next workflow slice.
              </p>
            </section>
          )}
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

function InquiryList({ result }: { result: AdminInquiryResult }) {
  if (!result.ok)
    return (
      <section className="border-border bg-surface rounded-lg border p-6">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted mt-3 text-sm">{result.message}</p>
      </section>
    );
  return (
    <section className="border-border bg-surface rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">CRM inbox</p>
          <h1 className="mt-2 text-2xl font-bold">Inquiries</h1>
        </div>
        <Inbox aria-hidden="true" className="text-brand size-6" />
      </div>
      {result.inquiries.length === 0 ? (
        <p className="text-muted mt-8 text-sm">
          No inquiries have been submitted yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-3">
          {result.inquiries.map((inquiry) => (
            <article
              className="border-border rounded-md border p-4"
              key={inquiry.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-bold">
                    {inquiry.name}{" "}
                    <span className="text-muted font-normal">
                      at {inquiry.company}
                    </span>
                  </h2>
                  <p className="text-muted mt-1 text-sm">
                    {inquiry.email} · {inquiry.property_type}
                  </p>
                  <p className="mt-3 text-sm leading-6">{inquiry.message}</p>
                </div>
                <form action={updateInquiryStatus} className="shrink-0">
                  <input name="id" type="hidden" value={inquiry.id} />
                  <select
                    aria-label={`Status for ${inquiry.name}`}
                    className="border-border bg-surface rounded-md border px-2 py-2 text-sm"
                    defaultValue={inquiry.status}
                    name="status"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    className="text-brand-strong ml-2 text-sm font-bold"
                    type="submit"
                  >
                    Save
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
