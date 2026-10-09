import Link from "next/link";

import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";

export function ThankYouPage() {
  return (
    <div className="marketing-site" id="top">
      <SiteHeader fromHome={false} />
      <main className="section-shell flex min-h-[60vh] items-center py-20">
        <section aria-labelledby="thank-you-heading" className="max-w-2xl">
          <p className="chapter-label">Lodging Technologies / Inquiry</p>
          <h1
            className="text-foreground mt-4 text-4xl font-semibold sm:text-5xl"
            id="thank-you-heading"
          >
            Thank you for reaching out.
          </h1>
          <p className="text-muted mt-6 text-lg leading-8">
            Thanks. Your request has been submitted. Our team will follow up
            about your property.
          </p>
          <Link
            className="bg-brand-fill mt-8 inline-flex min-h-12 items-center rounded-full px-6 py-3 font-semibold text-white transition-colors hover:brightness-90"
            href="/"
          >
            Back to home
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
