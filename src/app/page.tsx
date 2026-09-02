import { HeroSection } from "@/features/home/ui/hero-section";
import { PlatformSection } from "@/features/home/ui/platform-section";
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
        <PlatformSection />
      </main>
    </div>
  );
}
