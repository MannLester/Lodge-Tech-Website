"use client";

export function AnalyticsSettingsLink() {
  return (
    <button
      type="button"
      className="hover:text-brand-strong focus-visible:outline-brand min-h-11 rounded px-1 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
      onClick={() => window.dispatchEvent(new Event("lt:analytics-settings"))}
    >
      Analytics settings
    </button>
  );
}
