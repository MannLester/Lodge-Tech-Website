export const primaryNavigationItems = [
  { hash: "technology", label: "Technology" },
  { hash: "solutions", label: "Solutions" },
  { hash: "industries", label: "Industries" },
  { hash: "results", label: "Results" },
  { hash: "company", label: "Company" },
] as const;

export const solutionNavigationItems = [
  { href: "/solutions/gem-stat-et", label: "GEM Stat ET" },
  { href: "/solutions/gem-link-wireless", label: "GEM Link Wireless" },
  { href: "/solutions/lighting-controls", label: "Lighting Controls" },
  { href: "/solutions/appliance-controls", label: "Appliance Controls" },
] as const;

export function homeAnchor(hash: string, fromHome = true) {
  return `${fromHome ? "" : "/"}#${hash}`;
}
