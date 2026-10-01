import { Fragment } from "react";

type BrandTextProps = {
  children: string;
};

export function BrandText({ children }: BrandTextProps) {
  return children.split(/([™®])/u).map((part, index) =>
    part === "™" || part === "®" ? (
      <sup className="trademark-symbol" key={`${part}-${index}`}>
        {part}
      </sup>
    ) : (
      <Fragment key={`text-${index}`}>{part}</Fragment>
    ),
  );
}
