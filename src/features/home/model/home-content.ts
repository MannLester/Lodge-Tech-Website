export const navigationItems = [
  { href: "#technology", label: "Technology" },
  { href: "#solutions", label: "Solutions" },
  { href: "#industries", label: "Industries" },
  { href: "#results", label: "Results" },
  { href: "#company", label: "Company" },
] as const;

export const proofStats = [
  { label: "Years of Experience", value: "40+" },
  {
    label: "Installations Across North America & the Caribbean",
    value: "100,000+",
  },
  {
    label: "HVAC, Lighting, and Appliance Energy Expense Reduction",
    value: "40%",
  },
  { label: "in Utility Incentives Secured for Clients", value: "Millions" },
] as const;

export const proofTickerItems = [
  "Energy expense reduction strategies built for HVAC, lighting, and appliance loads.",
  "GEM Link Wireless and GEM Stat ET connect occupancy intelligence with practical building control.",
] as const;

export const valuePropositions = [
  {
    description:
      "Reduce HVAC, lighting, and appliance waste with controls that respond to occupancy and operating patterns.",
    title: "Reduce Energy Expense",
  },
  {
    description:
      "Coordinate equipment behavior to lower total consumption and costly peak demand.",
    title: "Lower Demand",
  },
  {
    description:
      "Identify, manage, and secure available utility incentives where programs support the project.",
    title: "Utility Incentives",
  },
  {
    description:
      "Structure projects around practical payback, incentives, and operating savings.",
    title: "Positive Cash Flow",
  },
  {
    description:
      "Move from analysis to installation, optimization, and ongoing support with one accountable team.",
    title: "Turnkey Solutions",
  },
] as const;

export const products = [
  {
    description:
      "Wireless occupancy-based HVAC control for guest rooms, units, and managed spaces.",
    mediaLabel: "GEM Stat ET product image",
    title: "GEM Stat ET",
  },
  {
    description:
      "Networked control that links thermostats, lighting, appliances, and portfolio visibility.",
    mediaLabel: "GEM Link Wireless product image",
    title: "GEM Link Wireless",
  },
  {
    description:
      "Lighting strategies that reduce waste while preserving expected comfort and safety.",
    mediaLabel: "Lighting control product image",
    title: "Lighting Controls",
  },
  {
    description:
      "Appliance and auxiliary load coordination for equipment that should not run unmanaged.",
    mediaLabel: "Appliance control product image",
    title: "Appliance Controls",
  },
] as const;

export const industries = [
  {
    description:
      "Reduce energy expense across guest rooms, common areas, and variable occupancy patterns.",
    mediaLabel: "Hospitality property photography",
    title: "Hospitality",
  },
  {
    description:
      "Apply intelligent control across apartments, shared spaces, amenities, and portfolio operations.",
    mediaLabel: "Multifamily property photography",
    title: "Multifamily",
  },
  {
    description:
      "Maintain comfort and predictable control across resident rooms and common areas.",
    mediaLabel: "Senior living photography",
    title: "Senior & Assisted Living",
  },
  {
    description:
      "Manage high-volume rooms and shared spaces across varied academic schedules.",
    mediaLabel: "Student housing photography",
    title: "Student Housing",
  },
  {
    description:
      "Control HVAC, lighting, and appliance loads around real building use.",
    mediaLabel: "Commercial office photography",
    title: "Commercial & Office",
  },
] as const;

export const caseStudies = [
  {
    location: "Miami, FL",
    payback: "1.8 yrs",
    property: "The Plaza Resort · 420 Keys",
    reduction: "42%",
    sector: "Hotel",
    utilityIncentive: "$182,000",
  },
  {
    location: "Toronto, ON",
    payback: "1.9 yrs",
    property: "Coleridge Towers · 280 Units",
    reduction: "38%",
    sector: "Multifamily",
    utilityIncentive: "$215,000",
  },
  {
    location: "Chicago, IL",
    payback: "2.1 yrs",
    property: "Assisted Living Facility",
    reduction: "35%",
    sector: "Senior Living",
    utilityIncentive: "$156,000",
  },
] as const;

export const turnkeySteps = [
  {
    description:
      "Assess building systems, utility data, and controllable load opportunities.",
    title: "Analyze",
  },
  {
    description:
      "Engineer a property-specific GEM Link Wireless and GEM Stat ET plan.",
    title: "Engineer",
  },
  {
    description:
      "Map eligible measures to available utility incentive programs.",
    title: "Incentivize",
  },
  {
    description:
      "Deploy controls with minimal disruption to residents, guests, and staff.",
    title: "Install",
  },
  {
    description:
      "Tune schedules, thresholds, and operating rules from field data.",
    title: "Optimize",
  },
  {
    description: "Monitor performance and support teams after installation.",
    title: "Maintain",
  },
] as const;
