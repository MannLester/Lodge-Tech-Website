import { BrandMark } from "@lodging-technologies/ui/brand-mark";

const footerLinkGroups = [
  {
    label: "Technology",
    links: [
      { href: "/#technology", label: "Energy Optimization" },
      { href: "/solutions/gem-link-wireless", label: "GEM Link Wireless" },
      { href: "/solutions/gem-stat-et", label: "GEM Stat ET" },
      { href: "/solutions/lighting-controls", label: "Lighting Controls" },
      { href: "/solutions/appliance-controls", label: "Appliance Controls" },
      { href: "/#technology", label: "Cloud Platform" },
      { href: "/#technology", label: "Utility Rebate Capture" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { href: "/#industries", label: "Hospitality" },
      { href: "/#industries", label: "Multifamily Housing" },
      { href: "/#industries", label: "Senior & Assisted Living" },
      { href: "/#industries", label: "Student Dormitories" },
      { href: "/#industries", label: "Commercial Properties" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "/#company", label: "About Us" },
      { href: "/#results", label: "Savings Review" },
      { href: "/#contact", label: "Partner Network" },
      { href: "/#contact", label: "Contact & Support" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/#contact", label: "Blog" },
      { href: "/#contact", label: "White Papers" },
      { href: "/#contact", label: "Webinars" },
      { href: "/#contact", label: "Savings Analysis" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface-muted border-t py-10">
      <div className="section-shell grid gap-10 md:grid-cols-[1.15fr_2fr] lg:grid-cols-[1fr_2.65fr]">
        <div className="max-w-64">
          <BrandMark href="/#top" />
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
  );
}
