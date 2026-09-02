import { HeroSection } from "@/features/home/ui/hero-section";
import { SiteHeader } from "@/features/home/ui/site-header";

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}
