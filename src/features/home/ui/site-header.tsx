"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navigationItems } from "@/features/home/model/home-content";
import { BrandMark } from "@/shared/ui/brand-mark";
import { ButtonLink } from "@/shared/ui/button-link";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7edf1] bg-white">
      <div className="section-shell flex min-h-[4.25rem] items-center justify-between gap-5">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) => (
            <a
              className="text-[0.875rem] font-normal text-[#343b40] transition-colors hover:text-[#1386b8]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <ButtonLink
            className="!min-h-10 !rounded-md !border-[#1386b8] !bg-[#1386b8] !px-5 !py-2 !text-[0.8125rem] !text-white hover:!border-[#0d709c] hover:!bg-[#0d709c]"
            href="#contact"
          >
            Get a Savings Analysis
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="grid size-10 cursor-pointer place-items-center rounded-md border border-[#dce5ea] bg-white text-[#17232b] transition-colors hover:bg-[#f1f7fa]"
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
          className="border-t border-[#e7edf1] bg-white px-4 py-5 lg:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto grid max-w-md gap-1">
            {navigationItems.map((item) => (
              <a
                className="border-b border-[#e7edf1] px-2 py-3 text-base font-normal text-[#343b40]"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <ButtonLink
              className="mt-4 w-full !border-[#1386b8] !bg-[#1386b8] !text-white hover:!border-[#0d709c] hover:!bg-[#0d709c]"
              href="#contact"
            >
              Get a Savings Analysis
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
