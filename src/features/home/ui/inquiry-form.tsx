"use client";

import { FormEvent, useState } from "react";

type InquiryFields = {
  company: string;
  email: string;
  message: string;
  name: string;
  propertyType: string;
};

type InquiryErrors = Partial<Record<keyof InquiryFields, string>>;

const initialFields: InquiryFields = {
  company: "",
  email: "",
  message: "",
  name: "",
  propertyType: "",
};

function validate(fields: InquiryFields): InquiryErrors {
  const errors: InquiryErrors = {};

  if (!fields.name.trim()) errors.name = "Enter your name.";
  if (!fields.company.trim()) {
    errors.company = "Enter your property or company.";
  }
  if (!fields.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!fields.propertyType) errors.propertyType = "Select a property type.";
  if (fields.message.trim().length < 12) {
    errors.message = "Tell us a little about the project.";
  }

  return errors;
}

export function InquiryForm() {
  const [fields, setFields] = useState<InquiryFields>(initialFields);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof InquiryFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setFields(initialFields);
    setSubmitted(true);
  }

  return (
    <form
      aria-label="Savings analysis inquiry"
      className="border-border bg-surface shadow-card grid gap-4 rounded-lg border p-5 text-left sm:p-6"
      noValidate
      onSubmit={handleSubmit}
    >
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
          <option>Hospitality</option>
          <option>Multifamily</option>
          <option>Senior living</option>
          <option>Student housing</option>
          <option>Commercial or office</option>
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
        className="bg-brand-fill hover:bg-brand-strong min-h-11 cursor-pointer rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        type="submit"
      >
        Submit Inquiry
      </button>

      <p aria-live="polite" className="min-h-5 text-sm font-semibold">
        {submitted
          ? "Thanks. Your savings analysis request is ready for follow-up."
          : ""}
      </p>
    </form>
  );
}
