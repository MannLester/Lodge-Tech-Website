"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Lock, ArrowRight, Mail } from "lucide-react";

import { updatePasswordAction } from "@/features/admin-auth/server/actions";

interface ResetPasswordFormProps {
  email: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-brand-fill hover:bg-brand-strong focus-visible:outline-brand inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "Updating password…" : "Update password"}
      <ArrowRight aria-hidden="true" className="size-4" />
    </button>
  );
}

export function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const [state, formAction] = useFormState<{ error?: string } | void, FormData>(
    updatePasswordAction,
    undefined,
  );

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
          Target account
        </label>
        <div className="relative">
          <input
            readOnly
            className="border-border bg-surface-muted text-muted w-full cursor-not-allowed rounded-md border px-3 py-2 pl-9 text-sm outline-none"
            id="email"
            type="email"
            value={email}
          />
          <Mail className="text-muted absolute top-2.5 left-3 size-4" />
        </div>
      </div>

      <div>
        <label
          className="text-foreground mb-1 block text-xs font-medium"
          htmlFor="password"
        >
          New password
        </label>
        <div className="relative">
          <input
            className="border-border bg-surface text-foreground hover:border-brand/60 focus:border-brand w-full rounded-md border px-3 py-2 pl-9 text-sm transition-colors outline-none"
            id="password"
            minLength={8}
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
