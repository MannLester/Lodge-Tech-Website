import { InquiryForm } from "@/features/home/ui/inquiry-form";
import { SiteFooter } from "@/shared/ui/site-footer";

type ClosingFooterProps = { initialInquiryMessage?: string };

export function ClosingFooter({ initialInquiryMessage }: ClosingFooterProps) {
  return (
    <>
      <section
        aria-labelledby="contact-heading"
        className="editorial-section contact-section"
        id="contact"
      >
        <div className="section-shell contact-layout">
          <div>
            <p className="chapter-label">Let’s put your building first</p>
            <h2 className="display-heading" id="contact-heading">
              Better energy use
              <br />
              starts with a<br />
              <em>conversation.</em>
            </h2>
            <p className="editorial-copy">
              Request a proposal or site survey. Tell us a little about your
              property, and we’ll help you explore the next step.
            </p>
            <div className="contact-next">
              <p className="chapter-label">What happens next</p>
              <p>
                We review your property details, discuss your operating needs,
                and help identify a suitable proposal or site survey.
              </p>
            </div>
          </div>
          <InquiryForm
            key={initialInquiryMessage}
            initialMessage={initialInquiryMessage}
          />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
