import type { Metadata } from "next";

import { ThankYouPage } from "@/features/inquiry-confirmation";

export const metadata: Metadata = {
  title: "Thank You | Lodging Technologies",
  description: "Your inquiry has been submitted to Lodging Technologies.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYouPage />;
}
