const productLabels = {
  "appliance-controls": "GEM Link® Wireless – Appliance Controls",
  "dhw-controls": "GEM Link® Wireless – DHW Controls",
  "gem-link-wireless": "GEM Link® Wireless – HVAC",
  "gem-stat-et": "GEM Stat™ ET",
  "lighting-controls": "GEM Link® Wireless – Lighting Control",
} as const;

const intentLabels = {
  demo: "request a product demo",
  savings: "request a savings analysis",
} as const;

export function getInquiryPrefill(search: string) {
  const parameters = new URLSearchParams(search);
  return getInquiryPrefillFromValues(
    parameters.get("product"),
    parameters.get("intent"),
  );
}

export function getInquiryPrefillFromValues(
  product: string | null | undefined,
  intent: string | null | undefined,
) {
  if (
    !product ||
    !(product in productLabels) ||
    !intent ||
    !(intent in intentLabels)
  ) {
    return "";
  }

  return `We would like to ${intentLabels[intent as keyof typeof intentLabels]} for ${productLabels[product as keyof typeof productLabels]}.`;
}
