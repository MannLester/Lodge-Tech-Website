import Image from "next/image";

import blueLogo from "@assets/gem_link_logo_blue.png";
import whiteLogo from "@assets/gem_link_logo_white.png";

type GemLinkBrandProps = {
  className?: string;
  label?: string;
  size?: "compact" | "small" | "medium" | "large";
  stacked?: boolean;
};

export function GemLinkBrand({
  className = "",
  label = "GEM Link Wireless",
  size = "medium",
  stacked = false,
}: GemLinkBrandProps) {
  const descriptor = /^GEM Link Wireless(?:™)?\s*[–-]\s*(.+)$/.exec(label)?.[1];
  const accessibleName = descriptor
    ? `GEM Link Wireless™ – ${descriptor}`
    : "GEM Link Wireless™";

  return (
    <span
      aria-label={accessibleName}
      className={[
        "gem-link-brand",
        `gem-link-brand--${size}`,
        stacked && "gem-link-brand--stacked",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
    >
      <span aria-hidden="true" className="gem-link-brand__lockup">
        <span className="gem-link-brand__artwork">
          <Image
            alt=""
            className="gem-link-brand__blue"
            loading="eager"
            sizes="(max-width: 767px) 192px, 320px"
            src={blueLogo}
          />
          <Image
            alt=""
            className="gem-link-brand__white"
            loading="eager"
            sizes="(max-width: 767px) 192px, 320px"
            src={whiteLogo}
          />
        </span>
        <sup className="gem-link-brand__trademark">™</sup>
      </span>
      {descriptor ? (
        <span aria-hidden="true" className="gem-link-brand__descriptor">
          – {descriptor}
        </span>
      ) : null}
    </span>
  );
}
