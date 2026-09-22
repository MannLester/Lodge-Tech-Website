import { InquiryForm } from "@/features/home/ui/inquiry-form";
import { SiteFooter } from "@/shared/ui/site-footer";

type ClosingFooterProps = {
  initialInquiryMessage?: string;
};

export function ClosingFooter({ initialInquiryMessage }: ClosingFooterProps) {
  return (
    <>
      <section
        aria-labelledby="contact-heading"
        className="border-border bg-surface-muted border-t py-16 sm:py-20 lg:py-24"
        id="contact"
      >
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Let&apos;s talk about your property</p>
            <h2
              className="text-foreground mt-4 max-w-lg text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl"
              id="contact-heading"
            >
              Request for Proposal / Site Survey
            </h2>
            <p className="text-muted mt-6 max-w-md text-base leading-7">
              Tell us about your property. We&apos;ll help you explore energy
              savings and plan the next step.
            </p>
            <ol className="text-foreground mt-8 grid gap-5 text-sm leading-6">
              <li className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="bg-brand-soft text-brand-strong grid size-9 shrink-0 place-items-center rounded-full font-semibold"
                >
                  1
                </span>
                Share your property details.
              </li>
              <li className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="bg-brand-soft text-brand-strong grid size-9 shrink-0 place-items-center rounded-full font-semibold"
                >
                  2
                </span>
                Discuss your needs with our team.
              </li>
              <li className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="bg-brand-soft text-brand-strong grid size-9 shrink-0 place-items-center rounded-full font-semibold"
                >
                  3
                </span>
                Explore a proposal or site survey.
              </li>
            </ol>
            <p className="text-muted mt-8 max-w-md text-sm leading-6">
              Interested in GEM Link® Wireless or GEM Stat™ ET? Mention it in
              your project notes.
            </p>
          </div>
          <InquiryForm initialMessage={initialInquiryMessage} />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
