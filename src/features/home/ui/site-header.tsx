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
    <header className="border-border bg-background sticky top-0 z-50 border-b">
      <div className="section-shell flex min-h-20 items-center justify-between gap-4">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) => (
            <a
              className="text-muted hover:text-brand-strong text-sm font-semibold transition-colors"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <ButtonLink href="#contact">Get a Savings Analysis</ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="border-border bg-surface hover:bg-surface-muted grid size-10 cursor-pointer place-items-center border transition-colors"
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
          className="border-border bg-background border-t px-4 py-5 lg:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto grid max-w-md gap-1">
            {navigationItems.map((item) => (
              <a
                className="border-border border-b px-2 py-3 text-base font-semibold"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <ButtonLink className="mt-4 w-full" href="#contact">
              Get a Savings Analysis
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
