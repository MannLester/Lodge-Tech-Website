import { HeroSection } from "@/features/home/ui/hero-section";
import { ProductSection } from "@/features/home/ui/product-section";
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
      </main>
    </div>
  );
}
