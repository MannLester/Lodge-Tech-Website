"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, Mail } from "lucide-react";

import { requestPasswordResetAction } from "@/features/admin-auth/server/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-brand-fill hover:bg-brand-strong focus-visible:outline-brand inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "Sending reset link…" : "Send reset link"}
      <ArrowRight aria-hidden="true" className="size-4" />
    </button>
  );
}

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

export function ForgotPasswordForm({
  onBackToSignIn,
}: ForgotPasswordFormProps) {
  const [state, formAction] = useFormState<
    { error?: string; success?: string } | void,
    FormData
  >(requestPasswordResetAction, undefined);

  const errorMessage =
    typeof state === "object" && state !== null && "error" in state
      ? state.error
      : null;
  const successMessage =
    typeof state === "object" && state !== null && "success" in state
      ? state.success
      : null;

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          className="text-foreground mb-1 block text-xs font-medium"
          htmlFor="forgot-password-email"
        >
          Email address
        </label>
        <div className="relative">
          <input
            className="border-border bg-surface text-foreground hover:border-brand/60 focus:border-brand w-full rounded-md border px-3 py-2 pl-9 text-sm transition-colors outline-none"
            id="forgot-password-email"
            name="email"
            placeholder="admin@company.com"
            required
            type="email"
          />
          <Mail className="text-muted absolute top-2.5 left-3 size-4" />
        </div>
      </div>

      {errorMessage ? (
        <p className="text-xs font-medium text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="text-xs font-medium text-green-700" role="status">
          {successMessage}
        </p>
      ) : null}

      <SubmitButton />

      <button
        className="text-muted hover:text-foreground w-full text-center text-xs font-medium underline-offset-2 transition-colors hover:underline"
        onClick={onBackToSignIn}
        type="button"
      >
        Back to sign in
      </button>
    </form>
  );
}
