"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

import { getBrowserSupabaseClient } from "@/shared/supabase/browser";

export function MicrosoftSignInButton() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setIsPending(true);
    setError(null);

    const supabase = getBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        scopes: "email openid profile",
      },
    });

    if (signInError) {
      setError("Unable to start Microsoft sign-in. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        className="bg-brand-fill hover:bg-brand-strong focus-visible:outline-brand inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        disabled={isPending}
        onClick={handleSignIn}
        type="button"
      >
        <LogIn aria-hidden="true" className="size-4" />
        {isPending ? "Redirecting to Microsoft…" : "Sign in with Microsoft"}
      </button>
      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
