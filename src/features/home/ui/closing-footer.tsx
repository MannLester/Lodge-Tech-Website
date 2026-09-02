import { Globe2 } from "lucide-react";

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
        className="min-h-[25rem] bg-[radial-gradient(circle_at_50%_35%,#164c68_0%,#0d344b_42%,#061b2a_100%)] py-20 text-white sm:py-24 lg:py-28"
        id="contact"
      >
        <div className="section-shell flex flex-col items-center justify-center text-center">
          <div className="mx-auto max-w-3xl">
            <h2
              className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl"
              id="contact-heading"
            >
              Your building is already consuming energy. Let&apos;s make it
              consume less.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 font-medium text-white/55 sm:text-base">
              Request a data-backed savings projection. See your building&apos;s
              exact runtime reduction opportunity and utility incentive
              alignment - at no cost.
            </p>
          </div>

          <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
            <a
              className="contact-primary inline-flex min-h-10 items-center justify-center rounded-md border border-white bg-white px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors hover:bg-[#e1f4fa]"
              href="#contact"
            >
              Get a Free Savings Analysis
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
            aria-label="40 plus years of energy intelligence"
            className="mt-10 inline-flex items-center gap-3 rounded-lg bg-white px-5 py-3 text-[#0b1216] shadow-[0_18px_55px_rgba(0,0,0,0.24)]"
          >
            <p className="text-center leading-none font-bold">
              <span className="block text-2xl">40+</span>
              <span className="text-[0.62rem]">YEARS</span>
            </p>
            <p className="max-w-24 text-left text-xs leading-4 font-semibold text-[#27343b]">
              of Energy Intelligence
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
