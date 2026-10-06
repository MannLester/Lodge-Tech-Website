import Image from "next/image";
import Link from "next/link";

import bbbAccreditedBusinessSeal from "@assets/bbb-accredited-business.svg";
import { BrandText } from "@/shared/ui/brand-text";
import { BrandMark } from "@lodging-technologies/ui/brand-mark";

const footerLinkGroups = [
  {
    label: "Products",
    links: [
      {
        href: "/solutions/gem-link-wireless",
        label: "GEM Link® Wireless – HVAC",
      },
      { href: "/solutions/gem-stat-et", label: "GEM Stat™ ET" },
      {
        href: "/solutions/lighting-controls",
        label: "GEM Link® Wireless – Lighting Controls",
      },
      {
        href: "/solutions/appliance-controls",
        label: "GEM Link® – Appliance Control",
      },
    ],
  },
  {
    label: "Services & industries",
    links: [
      { href: "/#results", label: "Property Savings Review" },
      { href: "/#process", label: "Our Turnkey Process" },
      { href: "/#industries", label: "Industries We Serve" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "/company", label: "About Us" },
      { href: "/results", label: "Property Results" },
      { href: "/#contact", label: "Contact & Support" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface-muted border-t py-10">
      <div className="section-shell grid gap-10 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[1fr_2.5fr]">
        <div className="max-w-64">
          <BrandMark href="/#top" />
          <p className="text-muted mt-4 text-sm leading-6">
            <BrandText>
              GEM Link® Wireless and GEM Stat™ ET energy management for lodging,
              multifamily, senior living, student housing, and commercial
              properties.
            </BrandText>
          </p>
          <p className="text-muted mt-4 text-sm leading-6">
            Proudly serving North America including the Caribbean.
          </p>
          <a
            aria-label="BBB Accredited Business with an A+ rating (opens in a new tab)"
            className="border-border hover:border-brand mt-5 inline-flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-colors"
            href="https://www.bbb.org/us/va/roanoke/profile/energy-management-consultant/lodging-technology-0613-1103"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="BBB Accredited Business"
              className="h-auto w-32 shrink-0 sm:w-36"
              src={bbbAccreditedBusinessSeal}
            />
            <span className="border-border flex flex-col border-l pl-3 text-center text-slate-950">
              <span className="text-[0.62rem] font-bold tracking-wide uppercase">
                BBB Rating
              </span>
              <strong className="text-2xl leading-none">A+</strong>
            </span>
          </a>
          <Link
            className="text-brand-strong mt-5 inline-block text-sm font-semibold underline underline-offset-4"
            href="/request-for-proposal"
          >
            Request for Proposal / Site Survey
          </Link>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {footerLinkGroups.map((group) => (
            <div key={group.label}>
              <h2 className="text-foreground text-xs font-bold tracking-wide uppercase">
                {group.label}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={`${group.label}-${link.label}`}>
                    <Link
                      className="text-muted hover:text-brand-strong inline-block text-sm leading-6 transition-colors hover:underline"
                      href={link.href}
                    >
                      <BrandText>{link.label}</BrandText>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="section-shell border-border text-muted mt-10 border-t pt-5 text-xs">
        &copy; 2026 Lodging Technologies LLC. All rights reserved.
      </div>
    </footer>
  );
}
