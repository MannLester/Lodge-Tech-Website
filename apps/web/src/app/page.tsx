import {
  ClosingFooter,
  CompanySection,
  getInquiryPrefillFromValues,
  HeroSection,
  IndustriesSection,
  ProcessSection,
  ProductSection,
  PlatformSection,
  ResultsSection,
  SiteHeader,
  ValueSection,
} from "@/features/home";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = await searchParams;
  const product = Array.isArray(query.product)
    ? query.product[0]
    : query.product;
  const intent = Array.isArray(query.intent) ? query.intent[0] : query.intent;
  const initialInquiryMessage = getInquiryPrefillFromValues(product, intent);

  return (
    <div className="marketing-site" id="top">
      <SiteHeader />
      <main>
        <HeroSection />
        <ValueSection />
        <ProductSection />
        <PlatformSection />
        <IndustriesSection />
        <ResultsSection />
        <CompanySection />
        <ProcessSection />
      </main>
      <ClosingFooter initialInquiryMessage={initialInquiryMessage} />
    </div>
  );
}
