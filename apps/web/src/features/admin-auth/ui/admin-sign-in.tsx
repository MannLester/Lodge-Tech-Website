"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

import { EmailSignInForm } from "@/features/admin-auth/ui/email-sign-in-form";
import { ForgotPasswordForm } from "@/features/admin-auth/ui/forgot-password-form";
import { MicrosoftSignInButton } from "@/features/admin-auth/ui/microsoft-sign-in-button";
import { BrandMark } from "@lodging-technologies/ui/brand-mark";

const authErrorMessages: Record<string, string> = {
  denied:
    "That account isn't authorized for CRM access. Contact an administrator to request an invite.",
  exchange_failed: "Microsoft sign-in failed. Please try again.",
  missing_code: "Microsoft sign-in was cancelled. Please try again.",
};

export function AdminSignIn({ authStatus }: { authStatus?: string }) {
  const authError = authStatus ? authErrorMessages[authStatus] : undefined;
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <main className="bg-surface-muted text-foreground flex min-h-screen items-center px-4 py-10 sm:px-6">
      <section
        aria-labelledby="admin-sign-in-title"
        className="border-border bg-surface shadow-card mx-auto grid w-full max-w-5xl overflow-hidden rounded-lg border lg:grid-cols-[1fr_24rem]"
      >
        <div className="p-6 sm:p-8 lg:p-10">
          <BrandMark />
          <div className="mt-8 max-w-xl">
            <p className="eyebrow">CRM Access</p>
            <h1
              className="mt-2 text-3xl leading-tight font-bold md:text-4xl"
              id="admin-sign-in-title"
            >
              {showForgotPassword
                ? "Reset Your Password"
                : "Sign in to the CRM"}
            </h1>
            <p className="text-muted mt-3 text-base leading-7">
              {showForgotPassword
                ? "Enter your registered email and we'll send you a link to reset your password."
                : "Authenticate using your Microsoft work account or registered email."}
            </p>
            {authError && (
              <p className="mt-4 text-sm text-red-700" role="alert">
                {authError}
              </p>
            )}
          </div>

          <div className="mt-8 max-w-md space-y-6">
            {showForgotPassword ? (
              <ForgotPasswordForm
                onBackToSignIn={() => setShowForgotPassword(false)}
              />
            ) : (
              <>
                <div>
                  <p className="text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
                    Corporate / Enterprise
                  </p>
                  <MicrosoftSignInButton />
                </div>

                <div className="relative flex items-center py-1">
                  <div className="border-border grow border-t" />
                  <span className="text-muted mx-4 shrink text-xs font-medium uppercase">
                    or email login
                  </span>
                  <div className="border-border grow border-t" />
                </div>

                <div>
                  <p className="text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
                    External / Partner
                  </p>
                  <EmailSignInForm
                    onForgotPassword={() => setShowForgotPassword(true)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <aside className="border-border bg-surface-muted border-t p-6 sm:p-8 lg:border-t-0 lg:border-l">
          <div className="bg-brand-soft text-brand-strong flex size-12 items-center justify-center rounded-md">
            <Shield aria-hidden="true" className="size-6" />
          </div>
          <h2 className="mt-6 text-lg font-bold">Access allowlisting</h2>
          <p className="text-muted mt-3 text-sm leading-6">
            Identity verification is handled via Microsoft SSO or verified
            email. Access to the CRM requires an active invite in the access
            management system.
          </p>
        </aside>
      </section>
    </main>
  );
}
