export const primaryNavigationItems = [
  { hash: "technology", label: "Technology" },
  { hash: "solutions", label: "Solutions" },
  { hash: "industries", label: "Industries" },
  { hash: "results", label: "Results" },
  { hash: "company", label: "Company" },
  { hash: "contact", label: "Contact Us" },
] as const;

export const solutionNavigationItems = [
  { href: "/solutions/gem-link-wireless", label: "GEM Link® Wireless – HVAC" },
  {
    href: "/solutions/lighting-controls",
    label: "GEM Link® Wireless – Lighting Controls",
  },
] as const;

export function homeAnchor(hash: string, fromHome = true) {
  return `${fromHome ? "" : "/"}#${hash}`;
}
