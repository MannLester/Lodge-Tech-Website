/* eslint-disable @next/next/no-img-element */

type BrandMarkProps = {
  className?: string;
  href?: string;
  logoClassName?: string;
  preload?: boolean;
  tone?: "auto" | "deep" | "primary" | "white";
};

const logoSources = {
  deep: "/brand/lodging-technologies-logo-deep-blue.svg",
  primary: "/brand/lodging-technologies-logo-primary.svg",
  white: "/brand/lodging-technologies-logo-white.svg",
} as const;

type LogoProps = {
  className: string;
  preload: boolean;
  src: (typeof logoSources)[keyof typeof logoSources];
};

function Logo({ className, preload, src }: LogoProps) {
  return (
    <img
      alt=""
      aria-hidden
      className={`brand-logo ${className}`}
      decoding="async"
      height="48"
      loading={preload ? "eager" : "lazy"}
      src={src}
      width="192"
    />
  );
}

export function BrandMark({
  className = "",
  href = "#top",
  logoClassName = "",
  preload = false,
  tone = "auto",
}: BrandMarkProps) {
  return (
    <a
      aria-label="Lodging Technologies home"
      className={`brand-mark inline-flex items-center ${className}`}
      href={href}
    >
      {tone === "auto" ? (
        <>
          <Logo
            className={`brand-logo--light ${logoClassName}`}
            preload={preload}
            src={logoSources.deep}
          />
          <Logo
            className={`brand-logo--dark ${logoClassName}`}
            preload={preload}
            src={logoSources.white}
          />
        </>
      ) : (
        <Logo
          className={logoClassName}
          preload={preload}
          src={logoSources[tone]}
        />
      )}
    </a>
  );
}
