"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

import {
  consumePendingMetaLead,
  META_PIXEL_ID,
  trackMetaEvent,
} from "@/shared/analytics/meta-pixel-events";

const baseCode = `
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq.disablePushState = true;
  fbq('set', 'autoConfig', false, '${META_PIXEL_ID}');
  fbq('init', '${META_PIXEL_ID}');
`;

export function MetaPixel() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  const trackPage = useCallback(() => {
    const path = window.location.pathname;
    if (lastPath.current === path || !trackMetaEvent("PageView")) return;
    lastPath.current = path;
    if (path === "/thank-you" && consumePendingMetaLead()) {
      trackMetaEvent("Lead");
    }
  }, []);

  useEffect(trackPage, [pathname, trackPage]);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive" onReady={trackPage}>
        {baseCode}
      </Script>
      <noscript>
        {/* A native image sends the pixel request without image optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
