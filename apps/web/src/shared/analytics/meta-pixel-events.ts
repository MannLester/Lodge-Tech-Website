export const META_PIXEL_ID = "1101924195888270";

const PENDING_LEAD_KEY = "lt:meta-pending-lead";

type MetaPixelWindow = Window & {
  fbq?: (command: "track", event: "PageView" | "Lead") => void;
};

export function trackMetaEvent(event: "PageView" | "Lead") {
  if (typeof window === "undefined") return false;
  const fbq = (window as MetaPixelWindow).fbq;
  if (!fbq) return false;
  try {
    fbq("track", event);
    return true;
  } catch {
    return false;
  }
}

export function markPendingMetaLead() {
  try {
    window.sessionStorage.setItem(PENDING_LEAD_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function consumePendingMetaLead() {
  try {
    if (window.sessionStorage.getItem(PENDING_LEAD_KEY) !== "1") return false;
    window.sessionStorage.removeItem(PENDING_LEAD_KEY);
    return true;
  } catch {
    return false;
  }
}
