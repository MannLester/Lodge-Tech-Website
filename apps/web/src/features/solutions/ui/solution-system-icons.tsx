import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const sharedProps = {
  "aria-hidden": true,
  fill: "none",
  focusable: "false",
  viewBox: "0 0 96 96",
} as const;

export function ThermostatIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path
        d="M24 19c0-5.5 4.5-10 10-10h28c5.5 0 10 4.5 10 10v58c0 5.5-4.5 10-10 10H34c-5.5 0-10-4.5-10-10V19Z"
        className="solution-icon-fill"
      />
      <path
        d="M24 19c0-5.5 4.5-10 10-10h28c5.5 0 10 4.5 10 10v58c0 5.5-4.5 10-10 10H34c-5.5 0-10-4.5-10-10V19Z"
        className="solution-icon-stroke"
      />
      <path d="M32 18h32" className="solution-icon-detail" />
      <rect
        className="solution-icon-screen"
        height="25"
        rx="3"
        width="30"
        x="33"
        y="27"
      />
      <text className="solution-icon-temperature" x="48" y="45">
        72°
      </text>
      <path d="m34 67 6-6 6 6m4 0 6-6 6 6" className="solution-icon-detail" />
      <circle className="solution-icon-dot" cx="48" cy="77" r="2" />
    </svg>
  );
}

export function PirSensorIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <circle
        className="solution-icon-fill solution-icon-stroke"
        cx="48"
        cy="48"
        r="37"
      />
      <circle className="solution-icon-screen" cx="48" cy="48" r="22" />
      <path
        d="M18 35h7m-4-10 7 4m50 6h-7m4-10-7 4M18 61h7m-4 10 7-4m50-6h-7m4 10-7-4M35 18v7m-10-4 4 7m32-10v7m10-4-4 7M35 78v-7m-10 4 4-7m32 10v-7m10 4-4-7"
        className="solution-icon-detail"
      />
      <path
        d="M38 46c5-5 15-5 20 0m-16 7c3-3 9-3 12 0"
        className="solution-icon-signal"
      />
      <circle className="solution-icon-dot" cx="48" cy="59" r="2.5" />
    </svg>
  );
}

export function DoorContactIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <rect
        className="solution-icon-fill solution-icon-stroke"
        height="56"
        rx="8"
        width="23"
        x="22"
        y="20"
      />
      <rect
        className="solution-icon-fill solution-icon-stroke"
        height="42"
        rx="7"
        width="18"
        x="57"
        y="27"
      />
      <path d="M30 29h7M30 67h7M63 35h6" className="solution-icon-detail" />
      <path d="M46 48h10" className="solution-icon-signal" />
      <circle className="solution-icon-dot" cx="51" cy="48" r="2.5" />
    </svg>
  );
}

export function TransceiverIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <rect
        className="solution-icon-fill solution-icon-stroke"
        height="72"
        rx="9"
        width="48"
        x="24"
        y="12"
      />
      <rect
        className="solution-icon-screen"
        height="21"
        rx="3"
        width="30"
        x="33"
        y="47"
      />
      <path d="M34 75h28M39 55h18" className="solution-icon-detail" />
      <path
        d="M38 35c5.5-5.5 14.5-5.5 20 0m-15-6c2.8-2.8 7.2-2.8 10 0"
        className="solution-icon-signal"
      />
      <circle className="solution-icon-dot" cx="48" cy="40" r="2.5" />
    </svg>
  );
}

export function HvacIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path
        d="M13 28c0-4.4 3.6-8 8-8h54c4.4 0 8 3.6 8 8v40c0 4.4-3.6 8-8 8H21c-4.4 0-8-3.6-8-8V28Z"
        className="solution-icon-fill solution-icon-stroke"
      />
      <path d="M20 31h56v15H20z" className="solution-icon-screen" />
      <path
        d="M24 36h48M24 41h48M22 57h52M22 63h52M28 70h40"
        className="solution-icon-detail"
      />
      <circle className="solution-icon-dot" cx="75" cy="54" r="2.5" />
    </svg>
  );
}

export function LightingIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path
        d="M48 10c-16 0-29 12.4-29 27.8 0 10.2 5.7 18.1 13.2 23.2 3.5 2.4 5.8 6.2 5.8 10.5V73h20v-1.5c0-4.3 2.3-8.1 5.8-10.5C71.3 55.9 77 48 77 37.8 77 22.4 64 10 48 10Z"
        className="solution-icon-fill solution-icon-stroke"
      />
      <path d="M38 79h20M41 86h14" className="solution-icon-detail" />
      <path d="m38 40 7 7 13-17" className="solution-icon-signal" />
    </svg>
  );
}

export function ApplianceIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <rect
        className="solution-icon-fill solution-icon-stroke"
        height="62"
        rx="7"
        width="68"
        x="14"
        y="17"
      />
      <path d="M14 34h68" className="solution-icon-detail" />
      <circle className="solution-icon-screen" cx="32" cy="55" r="11" />
      <circle className="solution-icon-screen" cx="63" cy="55" r="11" />
      <circle className="solution-icon-dot" cx="26" cy="26" r="2.5" />
      <circle className="solution-icon-dot" cx="36" cy="26" r="2.5" />
      <path d="M28 55h8M59 55h8" className="solution-icon-detail" />
    </svg>
  );
}
