import { Globe2, Leaf } from "lucide-react";

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
        className="bg-[#063d24] py-5 text-white sm:py-6"
        id="contact"
      >
        <div className="section-shell grid items-center gap-5 lg:grid-cols-[1fr_auto_auto]">
          <div className="flex min-w-0 items-center gap-4">
            <div
              aria-hidden
              className="hidden size-12 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/5 text-[#5cae57] sm:flex"
            >
              <Leaf size={28} strokeWidth={1.7} />
            </div>
            <h2
              className="max-w-3xl text-xl leading-tight font-bold text-white sm:text-2xl lg:text-3xl"
              id="contact-heading"
            >
              Your building is already consuming energy. Let&apos;s make it
              consume less.
            </h2>
          </div>

          <div className="grid w-full max-w-[33rem] gap-3 sm:grid-cols-3 lg:w-[29rem] xl:w-[33rem]">
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#2f8a39] bg-[#2f8a39] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#3fa64c] hover:bg-[#3fa64c]"
              href="#contact"
            >
              Get a Savings Analysis
            </a>
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/70 bg-transparent px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              href="#contact"
            >
              Request a Demo
            </a>
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/70 bg-transparent px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              href="#contact"
            >
              Talk to an Expert
            </a>
          </div>

          <div
            aria-label="40 plus years of energy intelligence"
            className="inline-flex w-fit items-center gap-3 justify-self-start text-white lg:justify-self-end"
          >
            <p className="flex size-12 items-center justify-center rounded-full border border-white/55 text-center text-lg leading-none font-bold">
              40+
            </p>
            <p className="max-w-28 text-left text-xs leading-4 font-bold tracking-wide text-white uppercase">
              of Energy Intelligence
            </p>
          </div>
        </div>
      </section>

      <footer
        className="border-border bg-background border-t py-5"
        id="company"
      >
        <div className="section-shell grid items-center gap-5 lg:grid-cols-[auto_1fr_auto]">
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
        <div className="section-shell text-muted mt-4 text-xs lg:text-center">
          &copy; 2026 Lodging Technologies. All rights reserved.
        </div>
      </footer>
    </>
  );
}
