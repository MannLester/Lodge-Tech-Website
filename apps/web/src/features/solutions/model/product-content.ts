import type { StaticImageData } from "next/image";

import auxiliaryImage from "@assets/auxiliary.png";
import gemStatOfficeSettingImage from "@assets/gem-stat-et/office-setting.jpeg";
import gemStatTreeSettingImage from "@assets/gem-stat-et/tree-setting.jpeg";
import gemStatThermostatImage from "@assets/gem-stat-et/thermostat.jpg";
import lightingImage from "@assets/lighting.png";
import platformImage from "@assets/platform-branded.png";

export const productSlugs = [
  "gem-stat-et",
  "gem-link-wireless",
  "lighting-controls",
  "dhw-controls",
  "appliance-controls",
] as const;

export type ProductSlug = (typeof productSlugs)[number];

export const solutionSlugs = [
  "gem-link-wireless",
  "lighting-controls",
  "dhw-controls",
  "appliance-controls",
] as const;

type Feature = {
  body: string;
  title: string;
};

type Showcase = Feature & {
  image?: StaticImageData;
  imageAlt?: string;
  imagePosition?: string;
};

type VideoBrief = {
  description: string;
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
  heroPhoto?: boolean;
  label: string;
  metaDescription: string;
  shortDescription: string;
  showcases: ReadonlyArray<Showcase>;
  slug: ProductSlug;
  specifications: ReadonlyArray<SpecificationGroup>;
  subtitle: string;
  videoBrief?: VideoBrief;
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
    label: "GEM Stat™ ET",
    eyebrow: "Occupancy-based HVAC control",
    subtitle: "Responsive room control for modern building operations.",
    description:
      "GEM Stat™ ET connects room-level comfort control with occupancy-aware energy management, helping operating teams reduce avoidable HVAC runtime while maintaining a clear experience for occupants.",
    shortDescription:
      "Room-level HVAC control designed to work within the connected GEM ecosystem.",
    metaDescription:
      "Explore the GEM Stat™ ET occupancy-based HVAC control solution.",
    heroImage: gemStatThermostatImage,
    heroImageAlt: "GEM Stat™ ET thermostat with room temperature display",
    heroPhoto: true,
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
        body: "Pair room-level control with GEM Link® Wireless for broader operational awareness.",
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
        image: gemStatTreeSettingImage,
        imageAlt:
          "GEM Stat™ ET thermostat pictured against a sunlit tree and park setting",
        imagePosition: "object-[center_35%]",
      },
      {
        title: "A clearer view for facility teams",
        body: "Connect individual spaces to portfolio-level monitoring and a consistent energy-management workflow.",
        image: gemStatOfficeSettingImage,
        imageAlt:
          "GEM Stat™ ET thermostat on a wall beside an office meeting room",
        imagePosition: "object-center",
      },
    ],
    videoBrief: {
      title: "GEM Stat™ ET, room by room.",
      description:
        "Film the thermostat in a guest room: show a guest adjusting comfort, then illustrate how the configured vacant strategy follows their departure.",
    },
    specifications: pendingSpecifications,
  },
  "gem-link-wireless": {
    slug: "gem-link-wireless",
    label: "GEM Link® Wireless – HVAC",
    eyebrow: "Connected HVAC control",
    subtitle:
      "Coordinate room comfort and HVAC operation across your property.",
    description:
      "GEM Link® Wireless connects supported room-level HVAC controls with a coordinated operating view, helping teams manage comfort and avoid unnecessary runtime across their property.",
    shortDescription:
      "Connected HVAC control with room-level comfort and property-wide visibility.",
    metaDescription:
      "Explore GEM Link® Wireless HVAC controls and property-wide visibility.",
    heroImage: platformImage,
    heroImageAlt:
      "Lodging Technologies logo prominently displayed on an illustrative laptop and phone platform dashboard",
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
        title: "Room-level control",
        body: "Connect supported thermostats, including GEM Stat™ ET, to a broader HVAC strategy.",
      },
      {
        title: "Operational continuity",
        body: "Create repeatable workflows across individual properties or a portfolio.",
      },
    ],
    showcases: [
      {
        title: "Connect the HVAC controls",
        body: "Create a common operating layer for supported thermostats and room-level HVAC applications.",
      },
      {
        title: "Move from signals to action",
        body: "Help teams identify operating patterns and focus attention where adjustments may matter most.",
      },
    ],
    videoBrief: {
      title: "One connected property, in view.",
      description:
        "Walk through a real or approved demo view, tracing supported room controls and building loads into a property-wide operating picture.",
    },
    specifications: pendingSpecifications,
  },
  "lighting-controls": {
    slug: "lighting-controls",
    label: "GEM Link® Wireless – Lighting Control",
    eyebrow: "Managed lighting",
    subtitle: "Align lighting operation with occupancy and property needs.",
    description:
      "Lighting control helps properties reduce unnecessary runtime in suitable spaces while preserving the visibility, comfort, and safety expected by occupants and operating teams.",
    shortDescription:
      "Practical lighting strategies coordinated around real building use.",
    metaDescription:
      "Explore GEM Link® Wireless lighting control for suitable property spaces.",
    heroImage: lightingImage,
    heroImageAlt: "Lighting controls product placeholder",
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
  "dhw-controls": {
    slug: "dhw-controls",
    label: "GEM Link® Wireless – DHW Controls",
    eyebrow: "Domestic hot water control",
    subtitle: "Plan domestic hot water operation around property demand.",
    description:
      "DHW controls address domestic hot water as a distinct building system. A suitable strategy depends on the property's equipment, demand patterns, and service requirements.",
    shortDescription:
      "A dedicated control strategy for domestic hot water systems.",
    metaDescription:
      "Explore GEM Link® Wireless controls for domestic hot water systems.",
    heroImage: auxiliaryImage,
    heroImageAlt: "Illustrative building control interface",
    features: [
      {
        title: "System-specific planning",
        body: "Assess the domestic hot water equipment and operating requirements before defining a control approach.",
      },
      {
        title: "Demand-aware operation",
        body: "Review when hot water is needed and where operating schedules may be appropriate.",
      },
      {
        title: "Service continuity",
        body: "Keep occupant hot water needs central to every proposed control strategy.",
      },
      {
        title: "Connected oversight",
        body: "Evaluate how a supported DHW application fits into the broader GEM Link® Wireless view.",
      },
    ],
    showcases: [
      {
        title: "Treat hot water as its own system",
        body: "Review plant equipment, storage, circulation, and service requirements before identifying suitable control opportunities.",
      },
      {
        title: "Coordinate with property operations",
        body: "Discuss how domestic hot water control can align with the building's wider energy-management plan.",
      },
    ],
    specifications: pendingSpecifications,
  },
  "appliance-controls": {
    slug: "appliance-controls",
    label: "GEM Link® Wireless – Appliance Controls",
    eyebrow: "Managed auxiliary loads",
    subtitle: "Coordinate equipment that should not operate unmanaged.",
    description:
      "Appliance Controls extend an energy-management strategy beyond HVAC, lighting, and domestic hot water to suitable plug loads, exhaust, and other auxiliary equipment applications.",
    shortDescription:
      "Control strategies for suitable appliance and auxiliary equipment loads.",
    metaDescription:
      "Explore GEM Link® Wireless controls for suitable appliance and auxiliary loads.",
    heroImage: auxiliaryImage,
    heroImageAlt: "Appliance controls product placeholder",
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
export const solutions = solutionSlugs.map((slug) => productDefinitions[slug]);

export function isProductSlug(value: string): value is ProductSlug {
  return productSlugs.includes(value as ProductSlug);
}

export function getProduct(slug: ProductSlug) {
  return productDefinitions[slug];
}

export function productCtaHref(slug: ProductSlug, intent: "demo" | "savings") {
  return `/?product=${slug}&intent=${intent}#contact`;
}
