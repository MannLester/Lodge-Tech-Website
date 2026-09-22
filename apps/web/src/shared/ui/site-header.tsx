"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import {
  homeAnchor,
  primaryNavigationItems,
  solutionNavigationItems,
} from "@/shared/config/navigation";
import { BrandMark } from "@lodging-technologies/ui/brand-mark";
import { ButtonLink } from "@lodging-technologies/ui/button-link";
import { ThemeToggle } from "@lodging-technologies/ui/theme-toggle";

type SiteHeaderProps = {
  fromHome?: boolean;
};

export function SiteHeader({ fromHome = true }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const contactHref = homeAnchor("contact", fromHome);

  return (
    <header className="border-border bg-surface sticky top-0 z-50 border-b transition-colors">
      <div className="section-shell flex min-h-[4.25rem] items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark href={fromHome ? "#top" : "/#top"} preload />
          <span className="border-border text-brand-strong hidden border-l pl-3 text-xs leading-4 font-semibold xl:block">
            GEM Link® Wireless / GEM Stat™ ET
          </span>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {primaryNavigationItems.map((item) =>
            item.hash === "solutions" ? (
              <details className="group relative" key={item.hash}>
                <summary className="text-muted hover:text-brand-strong flex cursor-pointer list-none items-center gap-1 text-[0.875rem] font-normal transition-colors marker:hidden">
                  {item.label}
                  <ChevronDown
                    aria-hidden
                    className="transition-transform group-open:rotate-180"
                    size={15}
                  />
                </summary>
                <div className="border-border bg-surface shadow-card absolute top-full left-1/2 mt-4 w-64 -translate-x-1/2 rounded-lg border p-2">
                  <a
                    className="text-brand-strong hover:bg-brand-soft block rounded-md px-3 py-2.5 text-sm font-semibold"
                    href={homeAnchor("solutions", fromHome)}
                  >
                    Solutions Overview
                  </a>
                  <div className="border-border my-1 border-t" />
                  {solutionNavigationItems.map((solution) => (
                    <a
                      className="text-muted hover:bg-surface-muted hover:text-brand-strong block rounded-md px-3 py-2.5 text-sm transition-colors"
                      href={solution.href}
                      key={solution.href}
                    >
                      {solution.label}
                    </a>
                  ))}
                </div>
              </details>
            ) : (
              <a
                className="text-muted hover:text-brand-strong text-[0.875rem] font-normal transition-colors"
                href={homeAnchor(item.hash, fromHome)}
                key={item.hash}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <ButtonLink
            className="!min-h-10 !px-5 !py-2 !text-[0.75rem] !text-white xl:!text-[0.8125rem]"
            href={contactHref}
          >
            Request for Proposal / Site Survey
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="border-border bg-surface text-foreground hover:bg-surface-muted grid size-10 cursor-pointer place-items-center rounded-md border transition-colors"
            onClick={() => setMenuOpen((open) => !open)}
            title={menuOpen ? "Close navigation" : "Open navigation"}
            type="button"
          >
            {menuOpen ? (
              <X aria-hidden size={20} />
            ) : (
              <Menu aria-hidden size={20} />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="border-border bg-surface border-t px-4 py-5 transition-colors lg:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto grid max-w-md gap-1">
            {primaryNavigationItems.map((item) =>
              item.hash === "solutions" ? (
                <div className="border-border border-b py-2" key={item.hash}>
                  <a
                    className="text-foreground block px-2 py-2 text-base font-semibold"
                    href={homeAnchor("solutions", fromHome)}
                    onClick={() => setMenuOpen(false)}
                  >
                    Solutions Overview
                  </a>
                  <div className="grid gap-1 pl-3">
                    {solutionNavigationItems.map((solution) => (
                      <a
                        className="text-muted hover:text-brand-strong px-2 py-2 text-sm transition-colors"
                        href={solution.href}
                        key={solution.href}
                        onClick={() => setMenuOpen(false)}
                      >
                        {solution.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  className="border-border text-muted hover:text-brand-strong border-b px-2 py-3 text-base font-normal transition-colors"
                  href={homeAnchor(item.hash, fromHome)}
                  key={item.hash}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
            <ButtonLink className="mt-4 w-full !text-white" href={contactHref}>
              Request for Proposal / Site Survey
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
