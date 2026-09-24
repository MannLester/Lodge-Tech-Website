import {
  ArrowLeft,
  BarChart3,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Mail,
  MessageSquareText,
  Phone,
  Save,
  Search,
  ShieldCheck,
  UsersRound,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  AdminAccountWorkspace,
  AdminAvatar,
  type AdminAccountResult,
} from "@/features/admin-account";
import {
  can,
  deleteInvitedCrmUser,
  inviteCrmUser,
  logoutAdmin,
  updateCrmUserRole,
  updateCrmUserStatus,
  type AdminAccessResult,
  type AdminAuditResult,
  type AdminSession,
} from "@/features/admin-auth";
import {
  addInquiryNoteAction,
  completeFollowUp,
  createFollowUp,
  filterInquiries,
  groupFollowUps,
  reportLeadStatuses,
  selectableLeadStatuses,
  summarizeInquiries,
  updateInquiryStatus,
  type AdminFollowUpResult,
  type AdminInquiryResult,
  type AdminLeadResult,
  type FollowUp,
  type Inquiry,
  type LeadFilters,
} from "@/features/inquiry";
import {
  WebsiteConversionReportPanel,
  type WebsiteConversionReport,
} from "@/features/website-analytics";
import { RoleProvider } from "@/hooks/useRole";
import { BrandMark } from "@lodging-technologies/ui/brand-mark";
import { ThemeToggle } from "@lodging-technologies/ui/theme-toggle";

type View =
  "account" | "dashboard" | "leads" | "tasks" | "reports" | "access" | "audit";
type Props = Readonly<{
  accessResult: AdminAccessResult | null;
  auditResult: AdminAuditResult | null;
  accountResult: AdminAccountResult;
  accountStatus?: string;
  filters: LeadFilters;
  followUpResult: AdminFollowUpResult;
  inquiryResult: AdminInquiryResult;
  session: AdminSession;
  view: View;
  websiteConversionReport: WebsiteConversionReport | null;
}>;

const navItems: {
  label: string;
  permission?: Parameters<typeof can>[1];
  view: View;
  icon: typeof LayoutDashboard;
}[] = [
  { label: "Dashboard", view: "dashboard", icon: LayoutDashboard },
  { label: "Leads", view: "leads", icon: Inbox },
  { label: "Tasks", view: "tasks", icon: ListTodo },
  {
    label: "Reports",
    view: "reports",
    icon: BarChart3,
    permission: "reports.read",
  },
  {
    label: "Access",
    view: "access",
    icon: UsersRound,
    permission: "access.manage",
  },
  {
    label: "Audit",
    view: "audit",
    icon: ClipboardList,
    permission: "audit.read",
  },
  { label: "Account", view: "account", icon: UserRound },
];

export function AdminDashboardPlaceholder({
  accessResult,
  auditResult,
  accountResult,
  accountStatus,
  filters,
  followUpResult,
  inquiryResult,
  session,
  view,
  websiteConversionReport,
}: Props) {
  const inquiries = inquiryResult.ok ? inquiryResult.inquiries : [];
  const followUps = followUpResult.ok ? followUpResult.followUps : [];
  return (
    <AdminShell
      accountResult={accountResult}
      activeView={view}
      session={session}
    >
      {view === "dashboard" && (
        <DashboardWorkspace
          followUpResult={followUpResult}
          inquiryResult={inquiryResult}
        />
      )}
      {view === "leads" && (
        <LeadsWorkspace filters={filters} result={inquiryResult} />
      )}
      {view === "tasks" && (
        <TasksWorkspace
          followUps={followUps}
          inquiries={inquiries}
          result={followUpResult}
        />
      )}
      {view === "reports" && (
        <ReportsWorkspace
          inquiries={inquiries}
          result={inquiryResult}
          websiteConversionReport={websiteConversionReport}
        />
      )}
      {view === "access" && (
        <AccessWorkspace result={accessResult ?? { ok: false, message: "" }} />
      )}
      {view === "audit" && (
        <AuditWorkspace result={auditResult ?? { ok: false, message: "" }} />
      )}
      {view === "account" && (
        <AdminAccountWorkspace result={accountResult} status={accountStatus} />
      )}
    </AdminShell>
  );
}

export function AdminLeadWorkspace({
  accountResult,
  result,
  session,
}: {
  accountResult: AdminAccountResult;
  result: AdminLeadResult;
  session: AdminSession;
}) {
  return (
    <AdminShell
      accountResult={accountResult}
      activeView="leads"
      session={session}
    >
      {!result.ok ? (
        <Panel>
          <p className="eyebrow">Lead workspace</p>
          <h1 className="mt-2 text-2xl font-bold">Lead unavailable</h1>
          <p className="text-muted mt-3 text-sm">{result.message}</p>
        </Panel>
      ) : (
        <LeadDetail result={result} />
      )}
    </AdminShell>
  );
}

function AdminShell({
  accountResult,
  activeView,
  children,
  session,
}: {
  accountResult: AdminAccountResult;
  activeView: View;
  children: ReactNode;
  session: AdminSession;
}) {
  const { account } = accountResult;

  return (
    <RoleProvider role={session.role}>
      <main className="bg-surface-muted text-foreground min-h-screen">
        <header className="border-border bg-surface border-b">
          <div className="mx-auto flex min-h-20 w-full max-w-7xl flex-col items-stretch justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 lg:px-8">
            <BrandMark />
            <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-end sm:gap-3">
              <ThemeToggle />
              <Link
                aria-current={activeView === "account" ? "page" : undefined}
                className="border-border bg-surface-muted hover:border-brand hover:bg-brand-soft inline-flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-md border px-2 py-1.5 transition sm:flex-none sm:gap-3 sm:px-2.5"
                href="/admin?view=account"
              >
                <AdminAvatar account={account} />
                <span className="min-w-0 text-left">
                  <span className="block truncate text-sm font-bold">
                    {account.displayName}
                  </span>
                  <span className="text-muted block max-w-44 truncate text-xs">
                    {session.email}
                  </span>
                </span>
                <ShieldCheck
                  aria-label="Verified administrator"
                  className="text-brand-strong size-4 shrink-0"
                />
              </Link>
              <form action={logoutAdmin}>
                <button
                  aria-label="Logout"
                  className="border-border bg-surface hover:border-brand hover:text-brand inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-bold transition sm:px-4"
                >
                  <LogOut aria-hidden="true" className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </header>
        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[15rem_1fr] lg:px-8 lg:py-8">
          <aside className="border-border bg-surface h-fit rounded-lg border p-3 lg:sticky lg:top-6">
            <nav
              aria-label="Admin workspace"
              className="grid grid-cols-2 gap-1 sm:grid-cols-5 lg:grid-cols-1"
            >
              {navItems
                .filter(
                  (item) =>
                    !item.permission || can(session.role, item.permission),
                )
                .map((item) => (
                  <Link
                    aria-current={item.view === activeView ? "page" : undefined}
                    className={
                      item.view === activeView
                        ? "bg-brand-soft text-brand-strong inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"
                        : "text-muted hover:text-brand inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
                    }
                    href={`/admin?view=${item.view}`}
                    key={item.view}
                  >
                    <item.icon aria-hidden="true" className="size-4" />
                    {item.label}
                  </Link>
                ))}
              <Link
                className="text-muted hover:text-brand inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
                href="/admin/proposals"
              >
                <ClipboardList aria-hidden="true" className="size-4" />
                Proposals
              </Link>
            </nav>
          </aside>
          <div className="grid min-w-0 gap-6">{children}</div>
        </section>
      </main>
    </RoleProvider>
  );
}

function DashboardWorkspace({
  followUpResult,
  inquiryResult,
}: {
  followUpResult: AdminFollowUpResult;
  inquiryResult: AdminInquiryResult;
}) {
  const inquiries = inquiryResult.ok ? inquiryResult.inquiries : [];
  const followUps = followUpResult.ok ? followUpResult.followUps : [];
  const today = todayKey();
  const groups = groupFollowUps(followUps, today);
  const openLeadIds = new Set(
    followUps
      .filter((task) => !task.completed_at)
      .map((task) => task.inquiry_id),
  );
  const noNextAction = inquiries.filter(
    (lead) =>
      ["New", "Contacted", "Qualified"].includes(lead.status) &&
      !openLeadIds.has(lead.id),
  ).length;
  const available = inquiryResult.ok && followUpResult.ok;

  return (
    <>
      <Panel>
        <p className="eyebrow">Light CRM</p>
        <h1 className="mt-2 text-3xl leading-tight font-bold md:text-4xl">
          Admin dashboard
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm leading-6">
          See what needs attention and keep every savings-analysis lead moving.
        </p>
      </Panel>
      {!available ? (
        <Notice>
          CRM data could not be loaded. Check the Supabase configuration.
        </Notice>
      ) : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="New leads"
          value={available ? countStatus(inquiries, "New") : "-"}
        />
        <Metric
          label="Overdue tasks"
          urgent
          value={available ? groups.overdue.length : "-"}
        />
        <Metric
          label="Due today"
          value={available ? groups.today.length : "-"}
        />
        <Metric label="No next task" value={available ? noNextAction : "-"} />
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <SectionHeading href="/admin?view=leads" title="Recent leads" />
          <div className="mt-4 grid gap-3">
            {inquiries.slice(0, 5).map((lead) => (
              <Link
                className="border-border hover:border-brand rounded-md border p-3 transition"
                href={`/admin/leads/${lead.id}`}
                key={lead.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold">{lead.name}</span>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="text-muted mt-1 text-sm">{lead.company}</p>
              </Link>
            ))}
            {inquiryResult.ok && inquiries.length === 0 ? (
              <Empty>No leads yet.</Empty>
            ) : null}
          </div>
        </Panel>
        <Panel>
          <SectionHeading href="/admin?view=tasks" title="Next tasks" />
          <div className="mt-4 grid gap-3">
            {[...groups.overdue, ...groups.today, ...groups.upcoming]
              .slice(0, 5)
              .map((task) => (
                <TaskSummary
                  inquiry={findLead(inquiries, task.inquiry_id)}
                  key={task.id}
                  task={task}
                />
              ))}
            {followUpResult.ok &&
            followUps.filter((task) => !task.completed_at).length === 0 ? (
              <Empty>No open tasks.</Empty>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}

function LeadsWorkspace({
  filters,
  result,
}: {
  filters: LeadFilters;
  result: AdminInquiryResult;
}) {
  if (!result.ok)
    return (
      <Panel>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-muted mt-3 text-sm">{result.message}</p>
      </Panel>
    );
  const validStatus = reportLeadStatuses.includes(filters.status!)
    ? filters.status
    : undefined;
  const appliedFilters = { ...filters, status: validStatus };
  const leads = filterInquiries(result.inquiries, appliedFilters);
  const propertyTypes = [
    ...new Set(result.inquiries.map((lead) => lead.property_type)),
  ].sort();

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">CRM inbox</p>
          <h1 className="mt-2 text-2xl font-bold">Leads</h1>
          <p className="text-muted mt-2 text-sm">
            Search inquiries and open a lead to manage its complete history.
          </p>
        </div>
        <Inbox aria-hidden="true" className="text-brand size-6" />
      </div>
      <form
        className="border-border bg-surface-muted mt-6 grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_12rem_12rem_auto]"
        method="get"
      >
        <input name="view" type="hidden" value="leads" />
        <label className="relative">
          <span className="sr-only">Search leads</span>
          <Search
            aria-hidden="true"
            className="text-muted absolute top-3 left-3 size-4"
          />
          <input
            className="border-border bg-surface w-full rounded-md border py-2 pr-3 pl-9"
            defaultValue={filters.query}
            name="q"
            placeholder="Search name, company, email…"
          />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select
            className="border-border bg-surface w-full rounded-md border px-3 py-2"
            defaultValue={validStatus ?? ""}
            name="status"
          >
            <option value="">All statuses</option>
            {reportLeadStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Property type</span>
          <select
            className="border-border bg-surface w-full rounded-md border px-3 py-2"
            defaultValue={filters.propertyType ?? ""}
            name="property"
          >
            <option value="">All properties</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {humanize(type)}
              </option>
            ))}
          </select>
        </label>
        <button className="bg-brand hover:bg-brand-fill min-h-10 rounded-md px-4 text-sm font-bold text-white transition">
          Filter
        </button>
      </form>
      <p className="text-muted mt-4 text-sm">
        {leads.length} {leads.length === 1 ? "lead" : "leads"}
      </p>
      <div className="mt-3 grid gap-3">
        {leads.map((lead) => (
          <article
            className="border-border rounded-md border p-4"
            key={lead.id}
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    className="hover:text-brand text-lg font-bold"
                    href={`/admin/leads/${lead.id}`}
                  >
                    {lead.name}
                  </Link>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="text-muted mt-1 text-sm">
                  {lead.company} · {humanize(lead.property_type)}
                </p>
                <p className="text-muted mt-1 truncate text-sm">
                  {lead.email}
                  {lead.phone ? ` · ${lead.phone}` : ""}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-6">
                  {lead.message}
                </p>
              </div>
              <Link
                className="border-brand text-brand-strong hover:bg-brand-soft inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-bold"
                href={`/admin/leads/${lead.id}`}
              >
                Open lead
              </Link>
            </div>
          </article>
        ))}
        {leads.length === 0 ? (
          <Empty>No leads match these filters.</Empty>
        ) : null}
      </div>
    </Panel>
  );
}

function TasksWorkspace({
  followUps,
  inquiries,
  result,
}: {
  followUps: FollowUp[];
  inquiries: Inquiry[];
  result: AdminFollowUpResult;
}) {
  if (!result.ok)
    return (
      <Panel>
        <p className="eyebrow">Light CRM</p>
        <h1 className="mt-2 text-2xl font-bold">Tasks</h1>
        <p className="text-muted mt-3 text-sm">{result.message}</p>
      </Panel>
    );
  const groups = groupFollowUps(followUps, todayKey());
  return (
    <>
      <Panel>
        <p className="eyebrow">Work queue</p>
        <h1 className="mt-2 text-2xl font-bold">Tasks</h1>
        <p className="text-muted mt-2 text-sm">
          Plan the next action for any lead and work tasks in due-date order.
        </p>
        <TaskForm inquiries={inquiries} />
      </Panel>
      <TaskGroup
        inquiries={inquiries}
        tasks={groups.overdue}
        title="Overdue"
        urgent
      />
      <TaskGroup inquiries={inquiries} tasks={groups.today} title="Due today" />
      <TaskGroup
        inquiries={inquiries}
        tasks={groups.upcoming}
        title="Upcoming"
      />
      <TaskGroup
        inquiries={inquiries}
        tasks={groups.unscheduled}
        title="No due date"
      />
      {groups.completed.length ? (
        <details className="border-border bg-surface rounded-lg border p-6">
          <summary className="cursor-pointer font-bold">
            Completed ({groups.completed.length})
          </summary>
          <div className="mt-4 grid gap-3">
            {groups.completed.map((task) => (
              <TaskCard
                inquiry={findLead(inquiries, task.inquiry_id)}
                key={task.id}
                task={task}
              />
            ))}
          </div>
        </details>
      ) : null}
    </>
  );
}

function LeadDetail({
  result,
}: {
  result: Extract<AdminLeadResult, { ok: true }>;
}) {
  const { activities, followUps, inquiry } = result;
  const timeline = buildTimeline(inquiry, activities, followUps);
  return (
    <>
      <Link
        className="text-brand-strong inline-flex items-center gap-2 text-sm font-bold"
        href="/admin?view=leads"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to leads
      </Link>
      <Panel>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="eyebrow">Lead workspace</p>
            <h1 className="mt-2 text-3xl font-bold">{inquiry.name}</h1>
            <p className="text-muted mt-1">
              {inquiry.company} · {humanize(inquiry.property_type)}
            </p>
          </div>
          <form action={updateInquiryStatus} className="flex items-end gap-2">
            <input name="id" type="hidden" value={inquiry.id} />
            <input name="context" type="hidden" value="detail" />
            <label className="text-sm font-semibold">
              Status
              <select
                className="border-border bg-surface mt-1 block rounded-md border px-3 py-2"
                defaultValue={inquiry.status}
                name="status"
              >
                {inquiry.status === "Closed" ? (
                  <option disabled value="Closed">
                    Needs outcome
                  </option>
                ) : null}
                {selectableLeadStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <button className="border-brand text-brand-strong hover:bg-brand-soft inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm font-bold">
              <Save aria-hidden="true" className="size-4" />
              Save
            </button>
          </form>
        </div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-6">
          <Panel>
            <h2 className="text-lg font-bold">Original inquiry</h2>
            <p className="mt-4 text-sm leading-7 whitespace-pre-wrap">
              {inquiry.message}
            </p>
            <p className="text-muted mt-4 text-xs">
              Received {formatDateTime(inquiry.created_at)}
            </p>
          </Panel>
          <Panel>
            <h2 className="text-lg font-bold">Activity</h2>
            <form
              action={addInquiryNoteAction}
              className="border-border mt-4 grid gap-3 rounded-md border p-4"
            >
              <input name="inquiry_id" type="hidden" value={inquiry.id} />
              <label className="text-sm font-semibold">
                Add a note
                <textarea
                  className="border-border bg-surface mt-1 w-full rounded-md border px-3 py-2"
                  maxLength={2000}
                  name="body"
                  required
                  rows={3}
                />
              </label>
              <button className="bg-brand hover:bg-brand-fill inline-flex min-h-10 w-fit items-center gap-2 rounded-md px-4 text-sm font-bold text-white">
                <MessageSquareText aria-hidden="true" className="size-4" />
                Add note
              </button>
            </form>
            <ol className="mt-6 grid gap-4">
              {timeline.map((event) => (
                <li className="border-border border-l-2 pl-4" key={event.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm">{event.title}</strong>
                    <time className="text-muted text-xs">
                      {formatDateTime(event.at)}
                    </time>
                  </div>
                  {event.detail ? (
                    <p className="mt-1 text-sm leading-6 whitespace-pre-wrap">
                      {event.detail}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </Panel>
        </div>
        <div className="grid h-fit gap-6">
          <Panel>
            <h2 className="text-lg font-bold">Contact</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <a
                className="text-brand-strong inline-flex items-center gap-2 break-all"
                href={`mailto:${inquiry.email}`}
              >
                <Mail aria-hidden="true" className="size-4 shrink-0" />
                {inquiry.email}
              </a>
              {inquiry.phone ? (
                <a
                  className="text-brand-strong inline-flex items-center gap-2"
                  href={`tel:${inquiry.phone}`}
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {inquiry.phone}
                </a>
              ) : (
                <span className="text-muted">No phone provided</span>
              )}
            </div>
          </Panel>
          <Panel>
            <h2 className="text-lg font-bold">Add next task</h2>
            <TaskForm
              context="detail"
              inquiries={[inquiry]}
              selectedInquiryId={inquiry.id}
            />
          </Panel>
          <Panel>
            <h2 className="text-lg font-bold">Open tasks</h2>
            <div className="mt-4 grid gap-3">
              {followUps
                .filter((task) => !task.completed_at)
                .map((task) => (
                  <TaskCard
                    context="detail"
                    inquiry={inquiry}
                    key={task.id}
                    task={task}
                  />
                ))}
              {followUps.every((task) => task.completed_at) ? (
                <Empty>No open tasks.</Empty>
              ) : null}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function ReportsWorkspace({
  inquiries,
  result,
  websiteConversionReport,
}: {
  inquiries: Inquiry[];
  result: AdminInquiryResult;
  websiteConversionReport: WebsiteConversionReport | null;
}) {
  if (!result.ok)
    return (
      <Panel>
        <p className="eyebrow">CRM reporting</p>
        <h1 className="mt-2 text-2xl font-bold">Reports</h1>
        <p className="text-muted mt-3 text-sm">{result.message}</p>
      </Panel>
    );
  const summary = summarizeInquiries(inquiries);
  return (
    <Panel>
      <p className="eyebrow">CRM reporting</p>
      <h1 className="mt-2 text-2xl font-bold">Reports</h1>
      <p className="text-muted mt-2 text-sm">
        A focused view of lead volume, outcomes, and demand.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Total leads" value={summary.total} />
        <Metric label="Open" value={summary.open} />
        <Metric label="Won" value={summary.won} />
        <Metric label="Lost" value={summary.lost} />
        <Metric
          label="Lead win rate"
          value={
            summary.conversionRate === null
              ? "—"
              : `${Math.round(summary.conversionRate)}%`
          }
        />
      </div>
      {summary.legacyClosed ? (
        <Notice>
          {summary.legacyClosed} legacy{" "}
          {summary.legacyClosed === 1 ? "lead needs" : "leads need"} a Won or
          Lost outcome. These records are excluded from conversion.
        </Notice>
      ) : null}
      {websiteConversionReport ? (
        <WebsiteConversionReportPanel report={websiteConversionReport} />
      ) : null}
      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <ChartGroup
          rows={summary.months.map((month) => [month.label, month.count])}
          title="Leads received · last 6 months"
        />
        <ChartGroup
          rows={reportLeadStatuses.map((status) => [
            statusLabel(status),
            summary.byStatus[status],
          ])}
          title="By status"
        />
        <ChartGroup
          rows={Object.entries(summary.byPropertyType).map(([label, count]) => [
            humanize(label),
            count,
          ])}
          title="By property type"
        />
      </div>
    </Panel>
  );
}

function AccessWorkspace({ result }: { result: AdminAccessResult }) {
  if (!result.ok)
    return (
      <Panel>
        <p className="eyebrow">Admin only</p>
        <h1 className="mt-2 text-2xl font-bold">Access</h1>
        <p className="text-muted mt-3 text-sm">
          {result.message || "Access users could not be loaded."}
        </p>
      </Panel>
    );

  return (
    <>
      <Panel>
        <p className="eyebrow">Admin only</p>
        <h1 className="mt-2 text-2xl font-bold">Access</h1>
        <p className="text-muted mt-2 text-sm">
          Add Google accounts and control each account&apos;s CRM role.
        </p>
        <form
          action={inviteCrmUser}
          className="border-border bg-surface-muted mt-6 grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_12rem_auto]"
        >
          <label>
            <span className="sr-only">Email</span>
            <input
              className="border-border bg-surface w-full rounded-md border px-3 py-2"
              name="email"
              placeholder="teammate@example.com"
              required
              type="email"
            />
          </label>
          <label>
            <span className="sr-only">Role</span>
            <select
              className="border-border bg-surface w-full rounded-md border px-3 py-2"
              defaultValue="USER"
              name="role"
            >
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <button className="bg-brand hover:bg-brand-fill min-h-10 rounded-md px-4 text-sm font-bold text-white transition">
            Add
          </button>
        </form>
      </Panel>
      <Panel>
        <h2 className="text-lg font-bold">Allowed accounts</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="text-muted border-border border-b">
              <tr>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Last login</th>
                <th className="py-3 pl-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.users.map((user) => (
                <tr className="border-border border-b" key={user.id}>
                  <td className="py-3 pr-4 font-semibold">{user.email}</td>
                  <td className="px-4 py-3">
                    <form action={updateCrmUserRole} className="flex gap-2">
                      <input name="id" type="hidden" value={user.id} />
                      <select
                        className="border-border bg-surface rounded-md border px-2 py-1"
                        defaultValue={user.role}
                        name="role"
                      >
                        <option value="USER">User</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button className="border-brand text-brand-strong hover:bg-brand-soft rounded-md border px-2 text-xs font-bold">
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={user.status} />
                  </td>
                  <td className="text-muted px-4 py-3">
                    {user.last_login_at
                      ? formatDateTime(user.last_login_at)
                      : "-"}
                  </td>
                  <td className="py-3 pl-4">
                    <div className="flex flex-wrap gap-2">
                      {user.status === "DISABLED" ? (
                        <form action={updateCrmUserStatus}>
                          <input name="id" type="hidden" value={user.id} />
                          <input name="status" type="hidden" value="INVITED" />
                          <button className="border-brand text-brand-strong hover:bg-brand-soft rounded-md border px-2 py-1 text-xs font-bold">
                            Re-enable
                          </button>
                        </form>
                      ) : (
                        <form action={updateCrmUserStatus}>
                          <input name="id" type="hidden" value={user.id} />
                          <input name="status" type="hidden" value="DISABLED" />
                          <button className="rounded-md border border-red-200 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-50">
                            Disable
                          </button>
                        </form>
                      )}
                      {user.status === "INVITED" ? (
                        <form action={deleteInvitedCrmUser}>
                          <input name="id" type="hidden" value={user.id} />
                          <button className="rounded-md border border-red-200 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-50">
                            Delete pending
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.users.length === 0 ? (
            <Empty>No allowed accounts.</Empty>
          ) : null}
        </div>
      </Panel>
    </>
  );
}

function AuditWorkspace({ result }: { result: AdminAuditResult }) {
  if (!result.ok)
    return (
      <Panel>
        <p className="eyebrow">Admin only</p>
        <h1 className="mt-2 text-2xl font-bold">Audit</h1>
        <p className="text-muted mt-3 text-sm">
          {result.message || "Audit logs could not be loaded."}
        </p>
      </Panel>
    );

  return (
    <Panel>
      <p className="eyebrow">Admin only</p>
      <h1 className="mt-2 text-2xl font-bold">Audit</h1>
      <p className="text-muted mt-2 text-sm">
        Security, access, and CRM mutation history.
      </p>
      <div className="mt-6 grid gap-3">
        {result.auditLogs.map((log) => (
          <article className="border-border rounded-md border p-4" key={log.id}>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h2 className="font-bold">{log.action}</h2>
                <p className="text-muted mt-1 text-sm">
                  {log.actor_email ?? "System"}{" "}
                  {log.actor_role ? `(${log.actor_role})` : ""}
                </p>
              </div>
              <time className="text-muted text-xs">
                {formatDateTime(log.created_at)}
              </time>
            </div>
            <p className="text-muted mt-3 text-sm">
              {log.resource_type}
              {log.resource_id ? ` - ${log.resource_id}` : ""}
            </p>
            {log.before_data || log.after_data ? (
              <pre className="bg-surface-muted mt-3 overflow-x-auto rounded-md p-3 text-xs">
                {JSON.stringify(
                  { before: log.before_data, after: log.after_data },
                  null,
                  2,
                )}
              </pre>
            ) : null}
          </article>
        ))}
        {result.auditLogs.length === 0 ? (
          <Empty>No audit logs yet.</Empty>
        ) : null}
      </div>
    </Panel>
  );
}

function TaskForm({
  context,
  inquiries,
  selectedInquiryId,
}: {
  context?: "detail";
  inquiries: Inquiry[];
  selectedInquiryId?: string;
}) {
  return (
    <form
      action={createFollowUp}
      className="border-border mt-4 grid gap-3 rounded-md border p-4"
    >
      {context ? <input name="context" type="hidden" value={context} /> : null}
      <label className="text-sm font-semibold">
        Lead
        <select
          className="border-border bg-surface mt-1 w-full rounded-md border px-3 py-2"
          defaultValue={selectedInquiryId ?? ""}
          disabled={Boolean(selectedInquiryId)}
          name={selectedInquiryId ? undefined : "inquiry_id"}
          required
        >
          <option value="">Select a lead</option>
          {inquiries.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.name} at {lead.company}
            </option>
          ))}
        </select>
      </label>
      {selectedInquiryId ? (
        <input name="inquiry_id" type="hidden" value={selectedInquiryId} />
      ) : null}
      <label className="text-sm font-semibold">
        Task
        <input
          className="border-border bg-surface mt-1 w-full rounded-md border px-3 py-2"
          maxLength={160}
          name="title"
          placeholder="Call prospect"
          required
        />
      </label>
      <label className="text-sm font-semibold">
        Due date
        <input
          className="border-border bg-surface mt-1 w-full rounded-md border px-3 py-2"
          name="due_at"
          type="date"
        />
      </label>
      <label className="text-sm font-semibold">
        Notes
        <textarea
          className="border-border bg-surface mt-1 w-full rounded-md border px-3 py-2"
          maxLength={2000}
          name="notes"
          rows={2}
        />
      </label>
      <button className="bg-brand hover:bg-brand-fill inline-flex min-h-10 w-fit items-center gap-2 rounded-md px-4 text-sm font-bold text-white">
        <ListTodo aria-hidden="true" className="size-4" />
        Add task
      </button>
    </form>
  );
}

function TaskGroup({
  inquiries,
  tasks,
  title,
  urgent = false,
}: {
  inquiries: Inquiry[];
  tasks: FollowUp[];
  title: string;
  urgent?: boolean;
}) {
  return (
    <Panel>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span
          className={
            urgent && tasks.length
              ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700"
              : "bg-surface-muted text-muted rounded-full px-2 py-0.5 text-xs font-bold"
          }
        >
          {tasks.length}
        </span>
      </div>
      <div className="mt-4 grid gap-3">
        {tasks.map((task) => (
          <TaskCard
            inquiry={findLead(inquiries, task.inquiry_id)}
            key={task.id}
            task={task}
          />
        ))}
        {tasks.length === 0 ? <Empty>Nothing here.</Empty> : null}
      </div>
    </Panel>
  );
}

function TaskCard({
  context,
  inquiry,
  task,
}: {
  context?: "detail";
  inquiry?: Inquiry;
  task: FollowUp;
}) {
  return (
    <article className="border-border rounded-md border p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h3
            className={
              task.completed_at
                ? "text-muted font-bold line-through"
                : "font-bold"
            }
          >
            {task.title}
          </h3>
          {inquiry ? (
            <Link
              className="text-brand-strong mt-1 inline-block text-sm font-semibold"
              href={`/admin/leads/${inquiry.id}`}
            >
              {inquiry.name} · {inquiry.company}
            </Link>
          ) : (
            <p className="text-muted mt-1 text-sm">Unknown lead</p>
          )}
          <p className="text-muted mt-1 inline-flex items-center gap-1 text-xs">
            <CalendarClock aria-hidden="true" className="size-3" />
            {task.due_at ? `Due ${formatDate(task.due_at)}` : "No due date"}
          </p>
          {task.notes ? <p className="mt-2 text-sm">{task.notes}</p> : null}
        </div>
        {task.completed_at ? (
          <span className="text-muted inline-flex items-center gap-1 text-sm font-semibold">
            <CheckCircle2 aria-hidden="true" className="size-4" />
            Completed
          </span>
        ) : (
          <form action={completeFollowUp}>
            <input name="id" type="hidden" value={task.id} />
            <input name="inquiry_id" type="hidden" value={task.inquiry_id} />
            {context ? (
              <input name="context" type="hidden" value={context} />
            ) : null}
            <button className="border-brand text-brand-strong hover:bg-brand-soft inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm font-bold">
              <Check aria-hidden="true" className="size-4" />
              Complete
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

function TaskSummary({ inquiry, task }: { inquiry?: Inquiry; task: FollowUp }) {
  return (
    <div className="border-border rounded-md border p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">{task.title}</p>
          {inquiry ? (
            <Link
              className="text-brand-strong mt-1 inline-block text-sm"
              href={`/admin/leads/${inquiry.id}`}
            >
              {inquiry.name} · {inquiry.company}
            </Link>
          ) : null}
        </div>
        <span className="text-muted shrink-0 text-xs">
          {task.due_at ? formatDate(task.due_at) : "No date"}
        </span>
      </div>
    </div>
  );
}

function ChartGroup({
  rows,
  title,
}: {
  rows: [string, number][];
  title: string;
}) {
  const max = Math.max(...rows.map(([, count]) => count), 1);
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {rows.map(([label, count]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{label}</span>
              <strong>{count}</strong>
            </div>
            <div
              aria-label={`${label}: ${count}`}
              className="bg-surface-muted h-3 overflow-hidden rounded-full"
              role="img"
            >
              <div
                className="bg-brand h-full rounded-full"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="border-border bg-surface shadow-card rounded-lg border p-5 sm:p-6">
      {children}
    </section>
  );
}
function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="border-brand bg-brand-soft text-brand-strong mt-4 rounded-md border p-3 text-sm font-semibold">
      {children}
    </p>
  );
}
function Empty({ children }: { children: ReactNode }) {
  return <p className="text-muted rounded-md py-3 text-sm">{children}</p>;
}
function Metric({
  label,
  urgent = false,
  value,
}: {
  label: string;
  urgent?: boolean;
  value: number | string;
}) {
  return (
    <article
      className={
        urgent && Number(value) > 0
          ? "rounded-lg border border-red-200 bg-red-50 p-5"
          : "border-border bg-surface rounded-lg border p-5"
      }
    >
      <p className="text-muted text-sm font-semibold">{label}</p>
      <p
        className={
          urgent && Number(value) > 0
            ? "mt-3 text-3xl font-bold text-red-700"
            : "mt-3 text-3xl font-bold"
        }
      >
        {value}
      </p>
    </article>
  );
}
function SectionHeading({ href, title }: { href: string; title: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold">{title}</h2>
      <Link className="text-brand-strong text-sm font-bold" href={href}>
        View all
      </Link>
    </div>
  );
}
function StatusBadge({ status }: { status: Inquiry["status"] }) {
  return (
    <span
      className={
        status === "Closed"
          ? "rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800"
          : status === "Won"
            ? "rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-800"
            : status === "Lost"
              ? "rounded-full bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700"
              : "bg-brand-soft text-brand-strong rounded-full px-2 py-1 text-xs font-bold"
      }
    >
      {statusLabel(status)}
    </span>
  );
}
function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={
        status === "DISABLED"
          ? "rounded-full bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700"
          : status === "ACTIVE"
            ? "rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-800"
            : "bg-brand-soft text-brand-strong rounded-full px-2 py-1 text-xs font-bold"
      }
    >
      {status}
    </span>
  );
}

function buildTimeline(
  inquiry: Inquiry,
  activities: Extract<AdminLeadResult, { ok: true }>["activities"],
  tasks: FollowUp[],
) {
  const events = [
    {
      id: `submitted-${inquiry.id}`,
      at: inquiry.created_at,
      title: "Inquiry received",
      detail: null as string | null,
    },
    ...activities.map((activity) => ({
      id: activity.id,
      at: activity.created_at,
      title:
        activity.activity_type === "note"
          ? "Note added"
          : `Status changed from ${statusLabel(activity.from_status ?? "")} to ${statusLabel(activity.to_status ?? "")}`,
      detail: activity.body,
    })),
    ...tasks.flatMap((task) => [
      {
        id: `task-created-${task.id}`,
        at: task.created_at,
        title: `Task added: ${task.title}`,
        detail: task.due_at ? `Due ${formatDate(task.due_at)}` : "No due date",
      },
      ...(task.completed_at
        ? [
            {
              id: `task-completed-${task.id}`,
              at: task.completed_at,
              title: `Task completed: ${task.title}`,
              detail: null,
            },
          ]
        : []),
    ]),
  ];
  return events.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

function findLead(inquiries: Inquiry[], id: string) {
  return inquiries.find((lead) => lead.id === id);
}
function countStatus(inquiries: Inquiry[], status: Inquiry["status"]) {
  return inquiries.filter((lead) => lead.status === status).length;
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function humanize(value: string) {
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function statusLabel(status: string) {
  return status === "Closed" ? "Needs outcome" : status;
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
