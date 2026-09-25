import type { Metadata } from "next";

import { CompanyPage } from "@/features/company";

export const metadata: Metadata = {
  title: "Company | Lodging Technologies",
  description:
    "Learn about Lodging Technologies, our mission, vision, and values in property energy management.",
};

export default function Page() {
  return <CompanyPage />;
}
