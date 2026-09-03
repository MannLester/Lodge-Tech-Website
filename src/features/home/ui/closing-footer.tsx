import { BrandMark } from "@/shared/ui/brand-mark";

import { InquiryForm } from "./inquiry-form";

const footerLinkGroups = [
  {
    label: "Technology",
    links: [
      { href: "#technology", label: "Energy Optimization" },
      { href: "#technology", label: "GEM Link Wireless" },
      { href: "#technology", label: "GEM Stat ET" },
      { href: "#technology", label: "Cloud Platform" },
      { href: "#technology", label: "Utility Rebate Capture" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { href: "#industries", label: "Hospitality" },
      { href: "#industries", label: "Multifamily Housing" },
      { href: "#industries", label: "Senior & Assisted Living" },
      { href: "#industries", label: "Student Dormitories" },
      { href: "#industries", label: "Commercial Properties" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "#company", label: "About Us" },
      { href: "#results", label: "Savings Review" },
      { href: "#contact", label: "Partner Network" },
      { href: "#contact", label: "Contact & Support" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "#contact", label: "Blog" },
      { href: "#contact", label: "White Papers" },
      { href: "#contact", label: "Webinars" },
      { href: "#contact", label: "Savings Analysis" },
    ],
  },
] as const;

export function ClosingFooter() {
  return (
    <>
      <section
        aria-labelledby="contact-heading"
        className="min-h-[25rem] bg-[radial-gradient(circle_at_50%_35%,#164c68_0%,#0d344b_42%,#061b2a_100%)] py-20 text-white sm:py-24 lg:py-28"
        id="contact"
      >
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.7fr)] lg:gap-14">
          <div className="text-center lg:text-left">
            <h2
              className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl"
              id="contact-heading"
            >
              Ready to reduce HVAC, lighting, and appliance energy expense?
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-6 font-medium text-white/70 sm:text-base">
              Request a savings analysis for GEM Link Wireless, GEM Stat ET, and
              turnkey controls across your property portfolio.
            </p>

            <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
              <a
                className="contact-primary inline-flex min-h-10 items-center justify-center rounded-md border border-white bg-white px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors hover:bg-[#e1f4fa]"
                href="#contact"
              >
                Get a Savings Analysis
              </a>
              <a
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#0096d7] bg-[#0096d7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#26b7ef] hover:bg-[#26b7ef]"
                href="#contact"
              >
                Request a Demo
              </a>
              <a
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#0086bd]/70 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#26b7ef] hover:bg-white/10"
                href="#contact"
              >
                Talk to an Expert
              </a>
            </div>

            <div
              aria-label="Since 1980 energy intelligence"
              className="mt-10 inline-flex items-center gap-3 rounded-lg bg-white px-5 py-3 text-[#0b1216] shadow-[0_18px_55px_rgba(0,0,0,0.24)]"
            >
              <p className="text-center leading-none font-bold">
                <span className="block text-2xl">1980</span>
                <span className="text-[0.62rem]">LEGACY</span>
              </p>
              <p className="max-w-28 text-left text-xs leading-4 font-semibold text-[#27343b]">
                GEM controls backed by 40+ years of energy intelligence
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">
              Savings analysis inquiry
            </p>
            <InquiryForm />
          </div>
        </div>
      </section>

      <footer
        className="border-border bg-surface-muted border-t py-10"
        id="company"
      >
        <div className="section-shell grid gap-10 md:grid-cols-[1.15fr_2fr] lg:grid-cols-[1fr_2.65fr]">
          <div className="max-w-64">
            <BrandMark />
            <p className="text-muted mt-4 text-sm leading-6">
              GEM Link Wireless and GEM Stat ET energy management for lodging,
              multifamily, senior living, student housing, and commercial
              properties.
            </p>
            <p className="text-muted mt-4 text-sm leading-6">
              Proudly serving North America including the Caribbean.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {footerLinkGroups.map((group) => (
              <div key={group.label}>
                <h2 className="text-foreground text-xs font-bold tracking-wide uppercase">
                  {group.label}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={`${group.label}-${link.label}`}>
                      <a
                        className="text-muted hover:text-brand-strong text-sm transition-colors"
                        href={link.href}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="section-shell border-border text-muted mt-10 border-t pt-5 text-xs">
          &copy; 2026 Lodging Technologies. All rights reserved.
        </div>
      </footer>
    </>
  );
}
