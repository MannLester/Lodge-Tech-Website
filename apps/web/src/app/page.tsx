import {
  ClosingFooter,
  HeroSection,
  IndustriesSection,
  ProcessSection,
  ProductSection,
  ResultsSection,
  SiteHeader,
  ValueSection,
} from "@/features/home";

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <HeroSection />
        <ValueSection />
        <ProductSection />
        <IndustriesSection />
        <ResultsSection />
        <ProcessSection />
      </main>
      <ClosingFooter />
    </div>
  );
}
