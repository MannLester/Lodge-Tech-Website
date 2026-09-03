import { LogIn, Shield } from "lucide-react";

import { loginAsDemoAdmin } from "@/features/admin-auth/server/actions";
import { BrandMark } from "@/shared/ui/brand-mark";

export function AdminSignIn() {
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
              Use the temporary demo administrator bypass while Google account
              authentication is being prepared.
            </p>
          </div>

          <form action={loginAsDemoAdmin} className="mt-8">
            <button
              className="bg-brand-fill hover:bg-brand-strong focus-visible:outline-brand inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-5 text-sm font-bold text-white transition sm:w-auto"
              type="submit"
            >
              <LogIn aria-hidden="true" className="size-4" />
              Login as demo admin
            </button>
          </form>
        </div>

        <aside className="border-border bg-surface-muted border-t p-6 sm:p-8 lg:border-t-0 lg:border-l">
          <div className="bg-brand-soft text-brand-strong flex size-12 items-center justify-center rounded-md">
            <Shield aria-hidden="true" className="size-6" />
          </div>
          <h2 className="mt-6 text-lg font-bold">Demo-only bypass</h2>
          <p className="text-muted mt-3 text-sm leading-6">
            This button creates a signed demo session for local CRM development.
            It is not a production security boundary.
          </p>
          <div className="border-border mt-8 border-t pt-6">
            <p className="text-muted text-sm font-semibold">Next auth phase</p>
            <p className="text-muted mt-2 text-sm leading-6">
              Google sign-in and administrator allowlisting will replace this
              bypass in a later task.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
