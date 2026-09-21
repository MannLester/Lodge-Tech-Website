"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, Mail, Lock } from "lucide-react";

import { signInWithEmailAction } from "@/features/admin-auth/server/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-brand-fill hover:bg-brand-strong focus-visible:outline-brand inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "Signing in…" : "Sign in with Email"}
      <ArrowRight aria-hidden="true" className="size-4" />
    </button>
  );
}

interface EmailSignInFormProps {
  onForgotPassword: () => void;
}

export function EmailSignInForm({ onForgotPassword }: EmailSignInFormProps) {
  const [state, formAction] = useFormState<{ error?: string } | void, FormData>(
    signInWithEmailAction,
    undefined,
  );

  // Type guard to isolate the error string and satisfy ReactNode types
  const errorMessage =
    typeof state === "object" && state !== null && "error" in state
      ? state.error
      : null;

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          className="text-foreground mb-1 block text-xs font-medium"
          htmlFor="email"
        >
          Email address
        </label>
        <div className="relative">
          <input
            className="border-border bg-surface text-foreground hover:border-brand/60 focus:border-brand w-full rounded-md border px-3 py-2 pl-9 text-sm transition-colors outline-none"
            id="email"
            name="email"
            placeholder="admin@company.com"
            required
            type="email"
          />
          <Mail className="text-muted absolute top-2.5 left-3 size-4" />
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label
            className="text-foreground block text-xs font-medium"
            htmlFor="password"
          >
            Password
          </label>
          <button
            className="text-brand-fill hover:text-brand-strong text-xs font-medium underline-offset-2 transition-colors hover:underline"
            onClick={onForgotPassword}
            type="button"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            className="border-border bg-surface text-foreground hover:border-brand/60 focus:border-brand w-full rounded-md border px-3 py-2 pl-9 text-sm transition-colors outline-none"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
          <Lock className="text-muted absolute top-2.5 left-3 size-4" />
        </div>
      </div>

      {errorMessage ? (
        <p className="text-xs font-medium text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
