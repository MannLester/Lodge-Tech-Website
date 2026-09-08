import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProduct,
  isProductSlug,
  productSlugs,
  ProductPage,
} from "@/features/solutions";

export const dynamicParams = false;

type SolutionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isProductSlug(slug)) return {};
  const product = getProduct(slug);

  return {
    description: product.metaDescription,
    robots: { follow: false, index: false },
    title: `${product.label} | Lodging Technologies`,
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  if (!isProductSlug(slug)) notFound();
  return <ProductPage product={getProduct(slug)} />;
}
