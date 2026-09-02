import { Globe2, ShieldCheck } from "lucide-react";

import { navigationItems } from "@/features/home/model/home-content";
import { BrandMark } from "@/shared/ui/brand-mark";

const footerLinks = [
  ...navigationItems,
  { href: "#contact", label: "Resources" },
  { href: "#contact", label: "Contact" },
] as const;

export function ClosingFooter() {
  return (
    <>
      <section
        aria-labelledby="contact-heading"
        className="bg-[#0c3b50] py-10 text-white"
        id="contact"
      >
        <div className="section-shell grid items-center gap-7 lg:grid-cols-[1fr_auto_auto]">
          <div>
            <p className="text-sm font-semibold text-[#b6dcea]">
              Your building is already consuming energy.
            </p>
            <h2
              className="mt-2 text-2xl leading-tight font-semibold sm:text-3xl"
              id="contact-heading"
            >
              Let&apos;s make it consume less.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <a
              className="contact-primary inline-flex min-h-11 items-center justify-center rounded-md border border-white bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#e1f4fa]"
              href="#contact"
            >
              Get a Savings Analysis
            </a>
            <a
              className="contact-secondary inline-flex min-h-11 items-center justify-center rounded-md border border-white/70 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white"
              href="#contact"
            >
              Request a Demo
            </a>
            <a
              className="contact-secondary inline-flex min-h-11 items-center justify-center rounded-md border border-white/70 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white"
              href="#contact"
            >
              Talk to an Expert
            </a>
          </div>

          <div className="flex items-center gap-3 lg:border-l lg:border-white/30 lg:pl-6">
            <ShieldCheck aria-hidden size={38} />
            <p className="text-xs leading-5 font-semibold uppercase">
              <span className="block text-lg">40+ years</span>
              of energy intelligence
            </p>
          </div>
        </div>
      </section>

      <footer
        className="border-border bg-background border-t py-8"
        id="company"
      >
        <div className="section-shell grid items-center gap-7 lg:grid-cols-[auto_1fr_auto]">
          <BrandMark />

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-3 lg:justify-center"
          >
            {footerLinks.map((link) => (
              <a
                className="text-muted hover:text-brand-strong text-xs font-semibold transition-colors"
                href={link.href}
                key={link.label}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="text-muted flex items-center gap-3 text-sm lg:max-w-64 lg:justify-self-end">
            <Globe2 aria-hidden className="text-brand shrink-0" size={24} />
            <span>Proudly serving North America, including the Caribbean.</span>
          </div>
        </div>
        <div className="section-shell border-border text-muted mt-7 border-t pt-5 text-xs">
          &copy; 2026 Lodging Technologies. All rights reserved.
        </div>
      </footer>
    </>
  );
}
