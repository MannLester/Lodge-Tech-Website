import { LogIn, Shield } from "lucide-react";

import { loginWithGoogle } from "@/features/admin-auth/server/actions";
import { BrandMark } from "@lodging-technologies/ui/brand-mark";

export function AdminSignIn({ denied = false }: { denied?: boolean }) {
  return (
    <main className="bg-surface-muted text-foreground flex min-h-screen items-center px-4 py-10 sm:px-6">
      <section
        aria-labelledby="admin-sign-in-title"
        className="border-border bg-surface shadow-card mx-auto grid w-full max-w-5xl overflow-hidden rounded-lg border lg:grid-cols-[1fr_24rem]"
      >
        <div className="p-6 sm:p-8 lg:p-10">
          <BrandMark />
          <div className="mt-12 max-w-xl">
            <p className="eyebrow">Admin access</p>
            <h1
              className="mt-3 text-3xl leading-tight font-bold md:text-4xl"
              id="admin-sign-in-title"
            >
              Sign in to the light CRM
            </h1>
            <p className="text-muted mt-4 text-base leading-7">
              Use your approved Google account to access the admin workspace.
            </p>
            {denied ? (
              <p
                className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700"
                role="alert"
              >
                This Google account is not approved for admin access.
              </p>
            ) : null}
          </div>

          <form action={loginWithGoogle} className="mt-8">
            <input name="next" type="hidden" value="/admin" />
            <button
              className="bg-brand-fill hover:bg-brand-strong focus-visible:outline-brand inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-5 text-sm font-bold text-white transition sm:w-auto"
              type="submit"
            >
              <LogIn aria-hidden="true" className="size-4" />
              Sign in with Google
            </button>
          </form>
        </div>

        <aside className="border-border bg-surface-muted border-t p-6 sm:p-8 lg:border-t-0 lg:border-l">
          <div className="bg-brand-soft text-brand-strong flex size-12 items-center justify-center rounded-md">
            <Shield aria-hidden="true" className="size-6" />
          </div>
          <h2 className="mt-6 text-lg font-bold">Restricted access</h2>
          <p className="text-muted mt-3 text-sm leading-6">
            Admin access is limited to Google accounts that have been added to
            the Supabase allowlist.
          </p>
          <div className="border-border mt-8 border-t pt-6">
            <p className="text-muted text-sm font-semibold">Access control</p>
            <p className="text-muted mt-2 text-sm leading-6">
              If your account is not on the list, you will be signed out
              immediately after Google authentication.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
