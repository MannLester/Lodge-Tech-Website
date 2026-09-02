import { ChartNoAxesColumnIncreasing } from "lucide-react";

export function BrandMark() {
  return (
    <a
      aria-label="Lodging Technologies home"
      className="inline-flex items-center gap-2.5"
      href="#top"
    >
      <ChartNoAxesColumnIncreasing
        aria-hidden
        className="text-[#1386b8]"
        size={30}
        strokeWidth={2.4}
      />
      <span className="text-foreground leading-none font-bold">
        <span className="block text-base sm:text-lg">LODGING</span>
        <span className="block text-[0.58rem] text-[#1386b8] uppercase sm:text-[0.66rem]">
          Technologies
        </span>
      </span>
    </a>
  );
}
