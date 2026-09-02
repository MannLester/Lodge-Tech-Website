import { FoundationStatus } from "@/features/home/ui/foundation-status";
import { SiteHeader } from "@/features/home/ui/site-header";

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main className="grid min-h-screen place-items-center px-6 py-16">
        <FoundationStatus />
      </main>
    </div>
  );
}
