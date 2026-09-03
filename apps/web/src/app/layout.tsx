import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/shared/config/site";
import { ThemeScript } from "@lodging-technologies/ui/theme-script";

import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
