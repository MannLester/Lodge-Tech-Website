import type { StaticImageData } from "next/image";

import auxiliaryImage from "@assets/auxiliary.png";
import hvacImage from "@assets/hvac.png";
import lightingImage from "@assets/lighting.png";
import platformImage from "@assets/platform.png";

export const productSlugs = [
  "gem-stat-et",
  "gem-link-wireless",
  "lighting-controls",
  "appliance-controls",
] as const;

export type ProductSlug = (typeof productSlugs)[number];

type Hotspot = {
  body: string;
  label: string;
  x: number;
  y: number;
};

type Feature = {
  body: string;
  title: string;
};

type SpecificationGroup = {
  items: ReadonlyArray<{ label: string; value: string }>;
  title: string;
};

export type ProductPageContent = {
  description: string;
  eyebrow: string;
  features: ReadonlyArray<Feature>;
  heroImage: StaticImageData;
  heroImageAlt: string;
  hotspots: ReadonlyArray<Hotspot>;
  label: string;
  metaDescription: string;
  shortDescription: string;
  showcases: ReadonlyArray<Feature>;
  slug: ProductSlug;
  specifications: ReadonlyArray<SpecificationGroup>;
  subtitle: string;
};

const pendingSpecifications: ReadonlyArray<SpecificationGroup> = [
  {
    title: "Performance and electrical",
    items: [
      { label: "Operating range", value: "Pending manufacturer verification" },
      {
        label: "Power requirements",
        value: "Pending manufacturer verification",
      },
      { label: "Control capacity", value: "Pending manufacturer verification" },
    ],
  },
  {
    title: "Connectivity and installation",
    items: [
      {
        label: "Supported protocols",
        value: "Pending manufacturer verification",
      },
      {
        label: "Mounting requirements",
        value: "Pending manufacturer verification",
      },
      {
        label: "Environmental rating",
        value: "Pending manufacturer verification",
      },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "CE", value: "Certification status pending verification" },
      { label: "UL", value: "Certification status pending verification" },
      {
        label: "ENERGY STAR",
        value: "Certification status pending verification",
      },
    ],
  },
];

const productDefinitions: Record<ProductSlug, ProductPageContent> = {
  "gem-stat-et": {
    slug: "gem-stat-et",
    label: "GEM Stat ET",
    eyebrow: "Occupancy-based HVAC control",
    subtitle: "Responsive room control for modern building operations.",
    description:
      "GEM Stat ET connects room-level comfort control with occupancy-aware energy management, helping operating teams reduce avoidable HVAC runtime while maintaining a clear experience for occupants.",
    shortDescription:
      "Room-level HVAC control designed to work within the connected GEM ecosystem.",
    metaDescription:
      "Explore the GEM Stat ET occupancy-based HVAC control solution.",
    heroImage: hvacImage,
    heroImageAlt: "GEM Stat ET thermostat product placeholder",
    hotspots: [
      {
        label: "Occupant controls",
        body: "Interface details are pending approved product documentation.",
        x: 39,
        y: 42,
      },
      {
        label: "Sensing area",
        body: "Sensor capabilities are pending manufacturer verification.",
        x: 62,
        y: 30,
      },
      {
        label: "Installation profile",
        body: "Mounting details are pending manufacturer verification.",
        x: 66,
        y: 70,
      },
    ],
    features: [
      {
        title: "Occupancy-aware operation",
        body: "Coordinate HVAC behavior around how rooms and managed spaces are actually used.",
      },
      {
        title: "Comfort-focused control",
        body: "Support energy decisions while keeping occupant interaction straightforward.",
      },
      {
        title: "Connected visibility",
        body: "Pair room-level control with GEM Link Wireless for broader operational awareness.",
      },
      {
        title: "Retrofit-oriented approach",
        body: "Evaluate deployment within existing properties and operating workflows.",
      },
    ],
    showcases: [
      {
        title: "Control at the point of use",
        body: "Give occupants a familiar room interface while enabling an operating strategy built around real occupancy patterns.",
      },
      {
        title: "A clearer view for facility teams",
        body: "Connect individual spaces to portfolio-level monitoring and a consistent energy-management workflow.",
      },
    ],
    specifications: pendingSpecifications,
  },
  "gem-link-wireless": {
    slug: "gem-link-wireless",
    label: "GEM Link Wireless",
    eyebrow: "Connected building intelligence",
    subtitle: "Bring distributed controls into one coordinated operating view.",
    description:
      "GEM Link Wireless provides the connective layer between supported room controls, building loads, and remote operational visibility so teams can manage more spaces with greater consistency.",
    shortDescription:
      "Wireless connectivity for coordinated controls and portfolio visibility.",
    metaDescription:
      "Explore the GEM Link Wireless connected building platform.",
    heroImage: platformImage,
    heroImageAlt: "GEM Link Wireless platform product placeholder",
    hotspots: [
      {
        label: "Portfolio view",
        body: "Dashboard capabilities are pending approved product documentation.",
        x: 36,
        y: 38,
      },
      {
        label: "Connected devices",
        body: "Supported device details are pending manufacturer verification.",
        x: 70,
        y: 32,
      },
      {
        label: "Operational insights",
        body: "Reporting details are pending manufacturer verification.",
        x: 62,
        y: 72,
      },
    ],
    features: [
      {
        title: "Central visibility",
        body: "Bring connected operating signals into one consistent view.",
      },
      {
        title: "Remote coordination",
        body: "Support property teams without requiring a visit to every managed space.",
      },
      {
        title: "Expandable ecosystem",
        body: "Connect HVAC, lighting, and managed appliance strategies.",
      },
      {
        title: "Operational continuity",
        body: "Create repeatable workflows across individual properties or a portfolio.",
      },
    ],
    showcases: [
      {
        title: "Connect the controllable loads",
        body: "Create a common operating layer for supported thermostats, lighting controls, and appliance applications.",
      },
      {
        title: "Move from signals to action",
        body: "Help teams identify operating patterns and focus attention where adjustments may matter most.",
      },
    ],
    specifications: pendingSpecifications,
  },
  "lighting-controls": {
    slug: "lighting-controls",
    label: "Lighting Controls",
    eyebrow: "Managed lighting",
    subtitle: "Align lighting operation with occupancy and property needs.",
    description:
      "Lighting Controls help properties reduce unnecessary runtime in suitable spaces while preserving the visibility, comfort, and safety expected by occupants and operating teams.",
    shortDescription:
      "Practical lighting strategies coordinated around real building use.",
    metaDescription:
      "Explore occupancy-aware lighting control solutions from Lodging Technologies.",
    heroImage: lightingImage,
    heroImageAlt: "Lighting controls product placeholder",
    hotspots: [
      {
        label: "Occupancy input",
        body: "Sensor compatibility is pending approved product documentation.",
        x: 32,
        y: 35,
      },
      {
        label: "Control zone",
        body: "Zone capacity is pending manufacturer verification.",
        x: 65,
        y: 45,
      },
      {
        label: "Schedule coordination",
        body: "Scheduling capabilities are pending manufacturer verification.",
        x: 52,
        y: 74,
      },
    ],
    features: [
      {
        title: "Occupancy response",
        body: "Coordinate suitable lighting loads around how spaces are used.",
      },
      {
        title: "Scheduling support",
        body: "Align operating schedules with property routines and staffed hours.",
      },
      {
        title: "Zone-level strategy",
        body: "Organize controls around the needs of individual areas.",
      },
      {
        title: "Connected management",
        body: "Evaluate integration with the broader GEM operating ecosystem.",
      },
    ],
    showcases: [
      {
        title: "Reduce avoidable runtime",
        body: "Focus control strategies on spaces where lighting can otherwise remain active without a clear operating need.",
      },
      {
        title: "Preserve the expected experience",
        body: "Balance energy priorities with appropriate visibility, safety, and occupant expectations.",
      },
    ],
    specifications: pendingSpecifications,
  },
  "appliance-controls": {
    slug: "appliance-controls",
    label: "Appliance Controls",
    eyebrow: "Managed auxiliary loads",
    subtitle: "Coordinate equipment that should not operate unmanaged.",
    description:
      "Appliance Controls extend an energy-management strategy beyond HVAC and lighting to suitable plug loads, water heating, exhaust, and other auxiliary equipment applications.",
    shortDescription:
      "Control strategies for suitable appliance and auxiliary equipment loads.",
    metaDescription:
      "Explore appliance and auxiliary load control solutions from Lodging Technologies.",
    heroImage: auxiliaryImage,
    heroImageAlt: "Appliance controls product placeholder",
    hotspots: [
      {
        label: "Managed load",
        body: "Supported equipment is pending approved product documentation.",
        x: 34,
        y: 42,
      },
      {
        label: "Control interface",
        body: "Interface details are pending manufacturer verification.",
        x: 67,
        y: 34,
      },
      {
        label: "Operating logic",
        body: "Automation details are pending manufacturer verification.",
        x: 59,
        y: 73,
      },
    ],
    features: [
      {
        title: "Broader load coverage",
        body: "Extend control planning beyond the largest HVAC and lighting loads.",
      },
      {
        title: "Application-specific logic",
        body: "Evaluate operating rules around each suitable equipment type.",
      },
      {
        title: "Schedule coordination",
        body: "Align selected loads with occupancy and operating requirements.",
      },
      {
        title: "Ecosystem integration",
        body: "Coordinate auxiliary applications with a broader property strategy.",
      },
    ],
    showcases: [
      {
        title: "Address overlooked operating expense",
        body: "Identify suitable equipment that may consume energy outside the periods when it provides useful service.",
      },
      {
        title: "Build a coordinated strategy",
        body: "Bring selected appliance and auxiliary loads into the same planning conversation as HVAC and lighting.",
      },
    ],
    specifications: pendingSpecifications,
  },
};

export const products = productSlugs.map((slug) => productDefinitions[slug]);

export function isProductSlug(value: string): value is ProductSlug {
  return productSlugs.includes(value as ProductSlug);
}

export function getProduct(slug: ProductSlug) {
  return productDefinitions[slug];
}

export function productCtaHref(slug: ProductSlug, intent: "demo" | "savings") {
  return `/?product=${slug}&intent=${intent}#contact`;
}
