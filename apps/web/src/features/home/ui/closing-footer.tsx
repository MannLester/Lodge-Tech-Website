import Link from "next/link";

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
            <p className="chapter-label">General inquiry</p>
            <h2 className="display-heading" id="contact-heading">
              Better energy use
              <br />
              starts with a<br />
              <em>conversation.</em>
            </h2>
            <p className="editorial-copy">
              Have a question about your property or our solutions? Send a
              general inquiry and we’ll help you find the right next step.
            </p>
            <div className="contact-direct">
              <p className="chapter-label">Call us</p>
              <a href="tel:+18005242680">(800) 524-2680</a>
            </div>
            <div className="contact-social">
              <p className="chapter-label">Find us online</p>
              <ul>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=100066727996704"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Facebook <span aria-hidden="true">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/lodging-technology-ltc-enterprises-llc"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="contact-next">
              <p className="chapter-label">What happens next</p>
              <p>
                Our team reviews your message and follows up to learn what you
                need. Ready with property details?{" "}
                <Link href="/request-for-proposal">
                  Request a proposal instead.
                </Link>
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
