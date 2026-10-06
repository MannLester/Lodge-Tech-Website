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
              <a href="tel:+18774355465">(877) 435-5465</a>
            </div>
            <div className="contact-social">
              <p className="chapter-label">Find us online</p>
              <ul>
                <li>
                  <a
                    aria-label="Facebook"
                    href="https://www.facebook.com/people/Lodging-Technologies/61594577464936/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      aria-hidden="true"
                      fill="currentColor"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.49 0-1.956.931-1.956 1.887v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    aria-label="LinkedIn"
                    href="https://www.linkedin.com/company/lodging-technologies"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      aria-hidden="true"
                      fill="currentColor"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.452 20.452h-3.555v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.354V8.997h3.414v1.564h.048c.475-.9 1.636-1.85 3.367-1.85 3.601 0 4.269 2.37 4.269 5.455v6.286ZM5.342 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126Zm1.78 13.019H3.56V8.997h3.562v11.455ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    aria-label="Instagram"
                    href="https://www.instagram.com/lodgingtechnologies/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      aria-hidden="true"
                      fill="currentColor"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                    </svg>
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
