import type { Metadata } from "next";

import { CompanyPage } from "@/features/company";

export const metadata: Metadata = {
  title: "Company | Lodging Technologies",
  description:
    "Learn how Lodging Technologies began in hotel energy management and how we work with properties today.",
};

export default function Page() {
  return <CompanyPage />;
}
