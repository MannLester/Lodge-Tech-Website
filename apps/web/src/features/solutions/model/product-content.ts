import type { StaticImageData } from "next/image";

import appliancePowerPackImage from "@assets/appliance-power-pack.jpeg";
import gemStatOfficeSettingImage from "@assets/gem-stat-et/office-setting.jpeg";
import gemStatTreeSettingImage from "@assets/gem-stat-et/tree-setting.jpeg";
import gemStatThermostatImage from "@assets/gem-stat-et/thermostat.jpg";
import lightingImage from "@assets/lighting.png";
import platformImage from "@assets/platform-branded.png";

export const productSlugs = [
  "gem-stat-et",
  "gem-link-wireless",
  "lighting-controls",
  "appliance-controls",
] as const;

export type ProductSlug = (typeof productSlugs)[number];

export const solutionSlugs = [
  "gem-link-wireless",
  "lighting-controls",
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
  heroImageClass?: string;
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
    heroImageAlt: "Illustrative lighting control interface",
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
    label: "GEM Link® – Appliance Control",
    eyebrow: "Managed in-room appliances",
    subtitle: "Coordinate selected equipment around real room use.",
    description:
      "GEM Link® Appliance Control extends an energy-management strategy to suitable in-room electric appliances, including two-burner cooktops and individual electric water heaters.",
    shortDescription:
      "Control selected in-room electric appliances around occupancy and operating needs.",
    metaDescription:
      "Explore GEM Link® Appliance Control for suitable in-room electric appliances.",
    heroImage: appliancePowerPackImage,
    heroImageAlt:
      "Power Pack appliance-control relay with red, black, and white wiring",
    heroImageClass: "object-contain p-4",
    heroPhoto: true,
    features: [
      {
        title: "Two-burner cooktops",
        body: "Evaluate occupancy-based control for suitable in-room electric cooktops.",
      },
      {
        title: "Individual water heaters",
        body: "Consider control for individual in-room electric water heaters where properties use them.",
      },
      {
        title: "Application-specific planning",
        body: "Match operating rules to the appliance, room, and property requirements.",
      },
      {
        title: "Connected coordination",
        body: "Bring suitable appliance applications into the broader GEM Link® strategy.",
      },
    ],
    showcases: [
      {
        title: "Designed for specific in-room loads",
        body: "Discuss two-burner cooktops and other suitable electric appliances as part of the room energy plan.",
      },
      {
        title: "A fit for select property types",
        body: "Individual in-room electric water-heater control may be relevant for timeshare properties and apartments where each unit has its own heater.",
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
