"use client";

import { type FormEvent, useState } from "react";

import { proposalSchema } from "@lodging-technologies/zod-schemas/proposals";

const inputClass = "proposal-input";
const optionalCount = (value: FormDataEntryValue | null) =>
  value === null || String(value).trim() === "" ? null : Number(value);
const value = (data: FormData, key: string) => String(data.get(key) ?? "");

export function ProposalForm() {
  const [suiteRows, setSuiteRows] = useState([0]);
  const [modelRows, setModelRows] = useState([0]);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = data
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const suites = suiteRows
      .map((index) => ({
        type: value(data, `suite-type-${index}`),
        hvacUnits: optionalCount(data.get(`suite-hvac-${index}`)),
        quantity: optionalCount(data.get(`suite-quantity-${index}`)),
      }))
      .filter(
        (suite) =>
          suite.type || suite.hvacUnits !== null || suite.quantity !== null,
      );
    const payload = {
      firstName: value(data, "firstName"),
      lastName: value(data, "lastName"),
      email: value(data, "email"),
      phone: value(data, "phone"),
      propertyName: value(data, "propertyName"),
      street: value(data, "street"),
      addressLine2: value(data, "addressLine2"),
      city: value(data, "city"),
      region: value(data, "region"),
      postalCode: value(data, "postalCode"),
      country: value(data, "country"),
      totalRooms: optionalCount(data.get("totalRooms")),
      standardRooms: optionalCount(data.get("standardRooms")),
      suiteCount: optionalCount(data.get("suiteCount")),
      suites,
      entry: value(data, "entry"),
      balcony: value(data, "balcony"),
      balconyCount: optionalCount(data.get("balconyCount")),
      hvacType: value(data, "hvacType"),
      hvacBrand: value(data, "hvacBrand"),
      hvacModels: modelRows
        .map((index) => value(data, `hvac-model-${index}`))
        .filter(Boolean),
      guestControl: value(data, "guestControl"),
      utilityCompany: value(data, "utilityCompany"),
      products: data.getAll("products").map(String),
      notes: value(data, "notes"),
      website: value(data, "website"),
    };
    const parsed = proposalSchema.safeParse(payload);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Please review the required fields.",
      );
      return;
    }
    if (
      files.length > 3 ||
      files.some((file) => file.size > 3 * 1024 * 1024) ||
      files.reduce((sum, file) => sum + file.size, 0) > 3.5 * 1024 * 1024
    ) {
      setError(
        "Attach up to three PDF, JPG, or PNG files, no more than 3 MB each and 3.5 MB total.",
      );
      return;
    }
    const body = new FormData();
    body.set("proposal", JSON.stringify(parsed.data));
    files.forEach((file) => body.append("files", file));
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/proposals", { method: "POST", body });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setSuiteRows([0]);
      setModelRows([0]);
      setStatus("success");
    } catch {
      setError(
        "We couldn't send your proposal request. Your entries are still here; please try again.",
      );
      setStatus("error");
    }
  }

  return (
    <form
      aria-label="Request for proposal"
      className="proposal-form"
      onSubmit={submit}
    >
      <div className="proposal-form-intro">
        <span className="chapter-label">Property profile</span>
        <p>
          Fields marked * are required. Share what you know; optional details
          help us prepare a more useful response.
        </p>
      </div>
      <div aria-hidden="true" className="proposal-honeypot">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <fieldset>
        <legend>01 / Your contact</legend>
        <div className="proposal-fields two">
          <label>
            First name *
            <input
              className={inputClass}
              name="firstName"
              required
              autoComplete="given-name"
            />
          </label>
          <label>
            Last name *
            <input
              className={inputClass}
              name="lastName"
              required
              autoComplete="family-name"
            />
          </label>
          <label>
            Email *
            <input
              className={inputClass}
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </label>
          <label>
            Phone number *
            <input
              className={inputClass}
              name="phone"
              type="tel"
              required
              autoComplete="tel"
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>02 / Your property</legend>
        <div className="proposal-fields two">
          <label>
            Property name *
            <input className={inputClass} name="propertyName" required />
          </label>
          <label>
            Street address *
            <input
              className={inputClass}
              name="street"
              required
              autoComplete="address-line1"
            />
          </label>
          <label>
            Address line 2
            <input
              className={inputClass}
              name="addressLine2"
              autoComplete="address-line2"
            />
          </label>
          <label>
            City *
            <input
              className={inputClass}
              name="city"
              required
              autoComplete="address-level2"
            />
          </label>
          <label>
            State / province / region *
            <input
              className={inputClass}
              name="region"
              required
              autoComplete="address-level1"
            />
          </label>
          <label>
            ZIP / postal code *
            <input
              className={inputClass}
              name="postalCode"
              required
              autoComplete="postal-code"
            />
          </label>
          <label>
            Country *
            <input
              className={inputClass}
              name="country"
              required
              autoComplete="country-name"
            />
          </label>
        </div>
        <div className="proposal-fields three proposal-counts">
          <label>
            Total rooms for rent
            <input
              className={inputClass}
              name="totalRooms"
              type="number"
              min="0"
            />
          </label>
          <label>
            Standard guestrooms
            <input
              className={inputClass}
              name="standardRooms"
              type="number"
              min="0"
            />
          </label>
          <label>
            Number of suites
            <input
              className={inputClass}
              name="suiteCount"
              type="number"
              min="0"
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>03 / Room configuration</legend>
        <p className="proposal-hint">
          For each suite type, note its layout, HVAC units, and quantity. Add
          more rows as needed.
        </p>
        {suiteRows.map((index, position) => (
          <div className="proposal-repeat" key={index}>
            <div className="proposal-fields three">
              <label>
                Suite type / layout
                <input
                  className={inputClass}
                  name={`suite-type-${index}`}
                  placeholder="Open room, 1-bedroom…"
                />
              </label>
              <label>
                HVAC units per suite
                <input
                  className={inputClass}
                  name={`suite-hvac-${index}`}
                  type="number"
                  min="0"
                />
              </label>
              <label>
                How many like this?
                <input
                  className={inputClass}
                  name={`suite-quantity-${index}`}
                  type="number"
                  min="0"
                />
              </label>
            </div>
            {position > 0 && (
              <button
                className="proposal-text-button"
                type="button"
                onClick={() =>
                  setSuiteRows((rows) => rows.filter((row) => row !== index))
                }
              >
                Remove suite type
              </button>
            )}
          </div>
        ))}
        <button
          className="proposal-text-button"
          type="button"
          onClick={() =>
            setSuiteRows((rows) => [...rows, Math.max(...rows) + 1])
          }
        >
          + Add suite type
        </button>
        <div className="proposal-fields two proposal-choices">
          <label>
            Entry to guestrooms *
            <select
              className={inputClass}
              name="entry"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="exterior">Exterior corridor</option>
              <option value="interior">Interior corridor</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label>
            Balcony / patio doors *
            <select
              className={inputClass}
              name="balcony"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="none">None</option>
              <option value="sliding">Sliding doors</option>
              <option value="swinging">Swinging doors</option>
            </select>
          </label>
          <label>
            Total balcony / patio doors
            <input
              className={inputClass}
              name="balconyCount"
              type="number"
              min="0"
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>04 / HVAC &amp; controls</legend>
        <div className="proposal-fields two">
          <label>
            Guest room HVAC system
            <select className={inputClass} name="hvacType" defaultValue="">
              <option value="">Select or describe below</option>
              <option>PTAC</option>
              <option>Mini-split</option>
              <option>Central HVAC</option>
              <option>Fan coil</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            HVAC brand
            <input className={inputClass} name="hvacBrand" />
          </label>
        </div>
        <p className="proposal-hint">HVAC model numbers (if known)</p>
        {modelRows.map((index, position) => (
          <div className="proposal-model-row" key={index}>
            <input
              aria-label={`HVAC model number ${position + 1}`}
              className={inputClass}
              name={`hvac-model-${index}`}
            />
            {position > 0 && (
              <button
                className="proposal-text-button"
                type="button"
                onClick={() =>
                  setModelRows((rows) => rows.filter((row) => row !== index))
                }
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          className="proposal-text-button"
          type="button"
          onClick={() =>
            setModelRows((rows) => [...rows, Math.max(...rows) + 1])
          }
        >
          + Add model number
        </button>
        <div className="proposal-fields two proposal-choices">
          <label>
            How do guests control HVAC? *
            <select
              className={inputClass}
              name="guestControl"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="wall">Wall thermostat</option>
              <option value="unit">On the unit</option>
              <option value="both">Both</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Electric utility company
            <input className={inputClass} name="utilityCompany" />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>05 / What you need</legend>
        <p className="proposal-hint">Products of interest</p>
        <div className="proposal-checks">
          <label>
            <input type="checkbox" name="products" value="gem-link-wireless" />{" "}
            GEM Link Wireless
          </label>
          <label>
            <input type="checkbox" name="products" value="gem-stat-et" /> GEM
            Stat ET thermostats
          </label>
        </div>
        <label className="proposal-full-label">
          Notes for your proposal
          <textarea
            className={inputClass}
            name="notes"
            rows={5}
            placeholder="Tell us about your goals, timeline, or any special conditions."
          />
        </label>
        <label className="proposal-full-label">
          Helpful files{" "}
          <span className="proposal-hint">
            Optional property plans or room diagrams. Up to 3 PDF, JPG, or PNG
            files; 3 MB per file, 3.5 MB total.
          </span>
          <input
            className={inputClass}
            name="files"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          />
        </label>
      </fieldset>
      <div className="proposal-submit">
        <p>Ready to plan the next step?</p>
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send proposal request"}{" "}
          <span aria-hidden>↗</span>
        </button>
      </div>
      <p aria-live="polite" className="proposal-feedback">
        {status === "success"
          ? "Thank you. Your proposal request has been received, and our team will follow up."
          : error}
      </p>
    </form>
  );
}
