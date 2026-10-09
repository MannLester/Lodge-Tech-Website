import type { Metadata } from "next";
import Script from "next/script";
import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

import { siteConfig } from "@/shared/config/site";
import { ThemeScript } from "@lodging-technologies/ui/theme-script";

import "./globals.css";

const montserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      className={montserrat.variable}
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        {children}
        <Analytics />
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            window._linkedin_partner_id = "9825954";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            if (!window._linkedin_data_partner_ids.includes(window._linkedin_partner_id)) {
              window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
            }
            (function(l) {
              if (!l) {
                window.lintrk = function(a, b) { window.lintrk.q.push([a, b]); };
                window.lintrk.q = [];
              }
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";
              b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
        <noscript>
          {/* The tracking pixel must use a native image without optimization. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://px.ads.linkedin.com/collect/?pid=9825954&fmt=gif"
          />
        </noscript>
      </body>
    </html>
  );
}
