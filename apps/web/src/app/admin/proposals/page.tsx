import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { readAdminSession } from "@/features/admin-auth";
import { getServerSupabaseClient } from "@/shared/supabase/server";

export const metadata: Metadata = {
  title: "Proposal requests | Admin",
  robots: { index: false, follow: false },
};

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map(display).join(", ");
  if (typeof value === "object")
    return Object.entries(value)
      .map(([key, item]) => `${key}: ${display(item)}`)
      .join(" · ");
  return String(value);
}

const labels: Record<string, string> = {
  street: "Street",
  addressLine2: "Address line 2",
  city: "City",
  region: "Region",
  postalCode: "Postal code",
  country: "Country",
  totalRooms: "Total rooms",
  standardRooms: "Standard guestrooms",
  suiteCount: "Suites",
  suites: "Suite details",
  entry: "Guestroom entry",
  balcony: "Balcony doors",
  balconyCount: "Balcony door count",
  hvacType: "HVAC system",
  hvacBrand: "HVAC brand",
  hvacModels: "HVAC models",
  guestControl: "Guest controls",
  utilityCompany: "Utility company",
  products: "Product interest",
  notes: "Notes",
};

export default async function AdminProposalsPage() {
  const session = await readAdminSession();
  if (!session) redirect("/admin");
  const { data, error } = await getServerSupabaseClient()
    .from("proposal_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return (
    <main className="bg-surface-muted text-foreground min-h-screen px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          className="text-brand-strong text-sm font-semibold underline"
          href="/admin?view=leads"
        >
          ← Back to admin
        </Link>
        <div className="mt-6 mb-8">
          <p className="text-muted text-xs font-bold tracking-widest uppercase">
            Private workspace
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Proposal requests</h1>
          <p className="text-muted mt-2">
            The 100 most recent property profiles, newest first.
          </p>
        </div>
        {error ? (
          <p className="border-border bg-surface rounded-lg border p-6">
            Proposal requests are unavailable. Check that the proposal migration
            has been applied.
          </p>
        ) : null}
        {!error && !data?.length ? (
          <p className="border-border bg-surface rounded-lg border p-6">
            No proposal requests yet.
          </p>
        ) : null}
        <div className="grid gap-5">
          {data?.map((proposal) => {
            const details =
              proposal.details &&
              typeof proposal.details === "object" &&
              !Array.isArray(proposal.details)
                ? proposal.details
                : {};
            const files = Array.isArray(proposal.attachments)
              ? proposal.attachments
              : [];
            return (
              <article
                className="border-border bg-surface rounded-xl border p-6"
                key={proposal.id}
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {proposal.property_name}
                    </h2>
                    <p className="text-muted mt-1 text-sm">
                      {proposal.first_name} {proposal.last_name} ·{" "}
                      <a
                        className="underline"
                        href={`mailto:${proposal.email}`}
                      >
                        {proposal.email}
                      </a>{" "}
                      ·{" "}
                      <a className="underline" href={`tel:${proposal.phone}`}>
                        {proposal.phone}
                      </a>
                    </p>
                  </div>
                  <time
                    className="text-muted text-xs"
                    dateTime={proposal.created_at}
                  >
                    {new Date(proposal.created_at).toLocaleString()}
                  </time>
                </div>
                <details className="mt-5">
                  <summary className="text-brand-strong cursor-pointer font-semibold">
                    View property details
                  </summary>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    {Object.entries(labels).map(([key, label]) => (
                      <div className="border-border border-t pt-2" key={key}>
                        <dt className="text-muted text-xs uppercase">
                          {label}
                        </dt>
                        <dd className="mt-1 text-sm break-words">
                          {display(details[key])}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {files.length > 0 && (
                    <div className="mt-5 border-t pt-4">
                      <h3 className="font-semibold">Attachments</h3>
                      <ul className="mt-2 grid gap-2">
                        {files.map((file, index) => {
                          const name =
                            typeof file === "object" && file && "name" in file
                              ? String(file.name)
                              : `Attachment ${index + 1}`;
                          return (
                            <li key={index}>
                              <a
                                className="text-brand-strong underline"
                                href={`/api/admin/proposals/${proposal.id}/attachments/${index}`}
                              >
                                {name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </details>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
