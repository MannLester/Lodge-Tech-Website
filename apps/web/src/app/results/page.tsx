import type { Metadata } from "next";

import { ResultsPage } from "@/features/results";

import "./results.css";

export const metadata: Metadata = {
  title: "Results | Lodging Technologies",
  description:
    "Explore historical GEM Link Wireless utility-cost results, including a five-building resort comparison and cost per occupied room data.",
};

export default function Page() {
  return <ResultsPage />;
}
