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
  { label: "Reduction in HVAC Runtime", value: "Up to 45%" },
  { label: "in Utility Incentives Secured for Our Clients", value: "Millions" },
] as const;

export const valuePropositions = [
  {
    description:
      "Cut HVAC runtime by up to 45%, depending on baseline conditions.",
    title: "Reduce Energy",
  },
  {
    description: "Reduce both total energy use and costly peak demand.",
    title: "Lower Demand",
  },
  {
    description: "Identify, manage, and secure available utility incentives.",
    title: "Utility Incentives",
  },
  {
    description:
      "Combine financing and incentives to improve monthly cash flow.",
    title: "Positive Cash Flow",
  },
  {
    description: "Move from analysis to installation and ongoing maintenance.",
    title: "Turnkey Solutions",
  },
] as const;

export const products = [
  {
    description: "Adjust room conditions around real occupancy and demand.",
    mediaLabel: "Occupancy HVAC product image",
    title: "Occupancy HVAC",
  },
  {
    description: "Coordinate efficient lighting without compromising comfort.",
    mediaLabel: "Lighting control product image",
    title: "Lighting Controls",
  },
  {
    description:
      "Reduce unnecessary ventilation runtime while protecting air quality.",
    mediaLabel: "Exhaust fan control product image",
    title: "Exhaust Fans",
  },
  {
    description:
      "Schedule domestic hot water and other high-load equipment intelligently.",
    mediaLabel: "DHW and load control product image",
    title: "DHW & Load Control",
  },
] as const;

export const industries = [
  {
    description:
      "Reduce energy use around the clock without compromising guest comfort.",
    mediaLabel: "Hospitality property photography",
    title: "Hospitality",
  },
  {
    description:
      "Apply intelligent control across apartments, shared spaces, and amenities.",
    mediaLabel: "Multifamily property photography",
    title: "Multifamily",
  },
  {
    description:
      "Maintain comfort and control across resident rooms and common areas.",
    mediaLabel: "Senior living photography",
    title: "Senior & Assisted Living",
  },
  {
    description:
      "Manage thousands of spaces across varied schedules and occupancy patterns.",
    mediaLabel: "Student housing photography",
    title: "Student Housing",
  },
  {
    description:
      "Stop conditioning empty spaces and optimize around real building use.",
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
    description: "Assess your building and identify savings opportunities.",
    title: "Analyze",
  },
  {
    description: "Design a solution tailored to your property.",
    title: "Engineer",
  },
  {
    description: "Identify and secure available utility incentives.",
    title: "Incentivize",
  },
  {
    description: "Deploy the system with minimal disruption.",
    title: "Install",
  },
  {
    description: "Fine-tune performance using real-time data.",
    title: "Optimize",
  },
  {
    description: "Monitor and support the system for lasting savings.",
    title: "Maintain",
  },
] as const;
