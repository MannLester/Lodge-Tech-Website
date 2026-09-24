import type { Metadata } from "next";
import Link from "next/link";

import { ProposalForm } from "@/features/proposals";
import { SiteHeader } from "@/shared/ui/site-header";
import { SiteFooter } from "@/shared/ui/site-footer";

export const metadata: Metadata = {
  title: "Request a Proposal | Lodging Technologies",
  description:
    "Tell us about your property and request a tailored energy-management proposal.",
};

export default function RequestForProposalPage() {
  return (
    <div className="marketing-site proposal-page" id="top">
      <SiteHeader fromHome={false} />
      <main>
        <section className="proposal-hero">
          <div className="section-shell">
            <p className="chapter-label">Start with your property</p>
            <h1>
              Request a <em>proposal.</em>
            </h1>
            <p>
              Every building works differently. Share a few details about yours
              and our team can explore the right power-saving options with you.
            </p>
          </div>
        </section>
        <section
          className="proposal-content section-shell"
          aria-label="Proposal request form"
        >
          <aside className="proposal-aside">
            <p className="chapter-label">A more useful first conversation</p>
            <h2>
              What helps us
              <br />
              <em>help you.</em>
            </h2>
            <p>
              Room layouts, HVAC equipment, and the way guests use your property
              shape the recommendation. You can leave optional details blank if
              you don’t have them yet.
            </p>
            <Link href="/#contact">
              Have a general question instead? Send an inquiry ↗
            </Link>
          </aside>
          <ProposalForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
