"use client";
import { useState } from "react";
import {
  campaignLink,
  platforms,
} from "@/features/website-analytics/model/traffic";
export function LinkGenerator() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const [fields, setFields] = useState<Record<string, string>>({
    destination: origin,
    source: "instagram",
    medium: "social",
    campaign: "",
    content: "",
    term: "",
  });
  const [copied, setCopied] = useState(false);
  let link = "",
    error = "";
  try {
    link = campaignLink(fields.destination, origin, fields);
  } catch {
    error =
      "Choose a valid destination on the configured public website and check your campaign values.";
  }
  return (
    <section className="border-border bg-surface space-y-5 rounded-lg border p-5 sm:p-6">
      <div>
        <p className="eyebrow">Campaign tools</p>
        <h2 className="mt-2 text-xl font-bold">UTM Link Generator</h2>
        <p className="text-muted mt-2 text-sm">
          Create a tagged link, then use the charts above to compare campaign
          traffic.
        </p>
      </div>
      <label className="block max-w-sm text-sm font-semibold">
        Preset{" "}
        <select
          className="border-border bg-surface mt-2 min-h-11 w-full rounded-md border px-3 py-2 font-normal"
          onChange={(e) => setFields({ ...fields, medium: e.target.value })}
        >
          <option value="social">Social profile/post</option>
          <option value="paid_social">Paid social</option>
          <option value="cpc">Google paid search</option>
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.keys(fields).map((key) => (
          <label
            className={`block text-sm font-semibold ${key === "destination" ? "sm:col-span-2" : ""}`}
            key={key}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <input
              aria-label={key}
              className="border-border bg-surface text-foreground focus-visible:outline-brand mt-2 min-h-11 w-full rounded-md border px-3 py-2 font-normal"
              list={key === "source" ? "campaign-sources" : undefined}
              value={fields[key]}
              maxLength={key === "destination" ? 2048 : 160}
              onChange={(e) => {
                setCopied(false);
                setFields({ ...fields, [key]: e.target.value });
              }}
            />
          </label>
        ))}
      </div>
      <datalist id="campaign-sources">
        {platforms.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <p className="text-muted text-xs">
        Do not include sensitive information in campaign labels.
      </p>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <output className="border-border bg-surface-muted block rounded-md border p-4 font-mono text-xs leading-6 break-all">
            {link}
          </output>
          <button
            className="bg-brand-fill hover:bg-brand-strong min-h-11 rounded-md px-5 py-2 text-sm font-bold text-white"
            onClick={() => {
              void navigator.clipboard
                .writeText(link)
                .then(() => setCopied(true))
                .catch(() => setCopied(false));
            }}
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </>
      )}
      <p className="text-muted max-w-3xl text-xs leading-5">
        Use each generated link on its matching social profile, post,
        advertisement, or campaign. Visitors who follow the tagged link can be
        attributed to that campaign. Do not use campaign tags on internal
        website navigation.
      </p>
    </section>
  );
}
