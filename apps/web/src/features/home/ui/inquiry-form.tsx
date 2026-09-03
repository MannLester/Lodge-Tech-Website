"use client";

import { FormEvent, useRef, useState } from "react";

import {
  getInquiryFieldErrors,
  inquirySubmissionSchema,
  PROPERTY_TYPES,
  type InquiryField,
  type InquirySubmissionInput,
} from "@lodging-technologies/zod-schemas/inquiries";

type InquiryFields = Required<InquirySubmissionInput>;
type InquiryErrors = Partial<Record<InquiryField | "_form", string>>;
type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const initialFields: InquiryFields = {
  company: "",
  email: "",
  message: "",
  name: "",
  phone: "",
  propertyType: "" as InquiryFields["propertyType"],
  website: "",
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readServerErrors(value: unknown): InquiryErrors {
  if (!isObject(value) || value.code !== "VALIDATION_ERROR") return {};
  if (!isObject(value.fieldErrors)) return {};

  const errors: InquiryErrors = {};

  for (const [field, message] of Object.entries(value.fieldErrors)) {
    if (typeof message === "string") {
      errors[field as InquiryField | "_form"] = message;
    }
  }

  return errors;
}

export function InquiryForm() {
  const [fields, setFields] = useState<InquiryFields>(initialFields);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const submittingRef = useRef(false);

  function updateField(field: keyof InquiryFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      _form: undefined,
    }));
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;

    const parsed = inquirySubmissionSchema.safeParse(fields);

    if (!parsed.success) {
      setErrors(getInquiryFieldErrors(parsed.error));
      setStatus("idle");
      return;
    }

    submittingRef.current = true;
    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/inquiries", {
        body: JSON.stringify(parsed.data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const body: unknown = await response.json().catch(() => null);

      if (response.ok && isObject(body) && body.ok === true) {
        setFields(initialFields);
        setStatus("success");
        return;
      }

      const serverErrors = readServerErrors(body);

      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors);
        setStatus("idle");
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  const formMessage =
    status === "success"
      ? "Thanks. Your savings analysis request has been submitted."
      : status === "error"
        ? "We couldn't submit your request. Your entries are still here; please try again."
        : errors._form;

  return (
    <form
      aria-label="Savings analysis inquiry"
      className="border-border bg-surface shadow-card grid gap-4 rounded-lg border p-5 text-left sm:p-6"
      noValidate
      onSubmit={handleSubmit}
    >
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label>
          Website
          <input
            autoComplete="off"
            name="website"
            onChange={(event) => updateField("website", event.target.value)}
            tabIndex={-1}
            value={fields.website}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-foreground grid gap-2 text-sm font-semibold">
          Name
          <input
            aria-describedby={errors.name ? "inquiry-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            className="border-border bg-background text-foreground min-h-11 rounded-md border px-3 text-sm"
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            value={fields.name}
          />
          {errors.name ? (
            <span className="text-brand-strong text-xs" id="inquiry-name-error">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className="text-foreground grid gap-2 text-sm font-semibold">
          Work email
          <input
            aria-describedby={errors.email ? "inquiry-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            className="border-border bg-background text-foreground min-h-11 rounded-md border px-3 text-sm"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            type="email"
            value={fields.email}
          />
          {errors.email ? (
            <span
              className="text-brand-strong text-xs"
              id="inquiry-email-error"
            >
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-foreground grid gap-2 text-sm font-semibold">
          Property or company
          <input
            aria-describedby={
              errors.company ? "inquiry-company-error" : undefined
            }
            aria-invalid={Boolean(errors.company)}
            className="border-border bg-background text-foreground min-h-11 rounded-md border px-3 text-sm"
            name="company"
            onChange={(event) => updateField("company", event.target.value)}
            value={fields.company}
          />
          {errors.company ? (
            <span
              className="text-brand-strong text-xs"
              id="inquiry-company-error"
            >
              {errors.company}
            </span>
          ) : null}
        </label>

        <label className="text-foreground grid gap-2 text-sm font-semibold">
          Phone (optional)
          <input
            aria-describedby={errors.phone ? "inquiry-phone-error" : undefined}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            className="border-border bg-background text-foreground min-h-11 rounded-md border px-3 text-sm"
            name="phone"
            onChange={(event) => updateField("phone", event.target.value)}
            type="tel"
            value={fields.phone}
          />
          {errors.phone ? (
            <span
              className="text-brand-strong text-xs"
              id="inquiry-phone-error"
            >
              {errors.phone}
            </span>
          ) : null}
        </label>
      </div>

      <label className="text-foreground grid gap-2 text-sm font-semibold">
        Property type
        <select
          aria-describedby={
            errors.propertyType ? "inquiry-property-type-error" : undefined
          }
          aria-invalid={Boolean(errors.propertyType)}
          className="border-border bg-background text-foreground min-h-11 rounded-md border px-3 text-sm"
          name="propertyType"
          onChange={(event) => updateField("propertyType", event.target.value)}
          value={fields.propertyType}
        >
          <option value="">Select one</option>
          {PROPERTY_TYPES.map((propertyType) => (
            <option key={propertyType.value} value={propertyType.value}>
              {propertyType.label}
            </option>
          ))}
        </select>
        {errors.propertyType ? (
          <span
            className="text-brand-strong text-xs"
            id="inquiry-property-type-error"
          >
            {errors.propertyType}
          </span>
        ) : null}
      </label>

      <label className="text-foreground grid gap-2 text-sm font-semibold">
        Project notes
        <textarea
          aria-describedby={
            errors.message ? "inquiry-message-error" : undefined
          }
          aria-invalid={Boolean(errors.message)}
          className="border-border bg-background text-foreground min-h-28 resize-y rounded-md border px-3 py-3 text-sm"
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          value={fields.message}
        />
        {errors.message ? (
          <span
            className="text-brand-strong text-xs"
            id="inquiry-message-error"
          >
            {errors.message}
          </span>
        ) : null}
      </label>

      <button
        className="bg-brand-fill hover:bg-brand-strong min-h-11 cursor-pointer rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Submitting…" : "Submit Inquiry"}
      </button>

      <p
        aria-live="polite"
        className={`min-h-5 text-sm font-semibold ${status === "error" || errors._form ? "text-brand-strong" : ""}`}
      >
        {formMessage ?? ""}
      </p>
    </form>
  );
}
