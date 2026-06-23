import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getProductBySlug } from "@/lib/api/content"
import { ProductDetail } from "@/components/products/product-detail"

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Produit" }
  return {
    title: product.name,
    description: product.taglineFr,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return <ProductDetail product={product} />
}
