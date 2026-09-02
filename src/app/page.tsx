import { ClosingFooter } from "@/features/home/ui/closing-footer";
import { HeroSection } from "@/features/home/ui/hero-section";
import { IndustriesSection } from "@/features/home/ui/industries-section";
import { PlatformSection } from "@/features/home/ui/platform-section";
import { ProcessSection } from "@/features/home/ui/process-section";
import { ProductSection } from "@/features/home/ui/product-section";
import { ResultsSection } from "@/features/home/ui/results-section";
import { SiteHeader } from "@/features/home/ui/site-header";
import { ValueSection } from "@/features/home/ui/value-section";

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <HeroSection />
        <ValueSection />
        <ProductSection />
        <PlatformSection />
        <IndustriesSection />
        <ResultsSection />
        <ProcessSection />
      </main>
      <ClosingFooter />
    </div>
  );
}
