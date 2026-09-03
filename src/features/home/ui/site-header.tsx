"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navigationItems } from "@/features/home/model/home-content";
import { BrandMark } from "@/shared/ui/brand-mark";
import { ButtonLink } from "@/shared/ui/button-link";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-border bg-surface sticky top-0 z-50 border-b transition-colors">
      <div className="section-shell flex min-h-[4.25rem] items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark />
          <span className="border-border text-muted hidden border-l pl-3 text-xs leading-4 xl:block">
            GEM Link Wireless / GEM Stat ET
          </span>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) => (
            <a
              className="text-muted hover:text-brand-strong text-[0.875rem] font-normal transition-colors"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <ButtonLink
            className="!min-h-10 !px-5 !py-2 !text-[0.8125rem] !text-white"
            href="#contact"
          >
            Get a Savings Analysis
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
            {navigationItems.map((item) => (
              <a
                className="border-border text-muted hover:text-brand-strong border-b px-2 py-3 text-base font-normal transition-colors"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <ButtonLink className="mt-4 w-full !text-white" href="#contact">
              Get a Savings Analysis
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
