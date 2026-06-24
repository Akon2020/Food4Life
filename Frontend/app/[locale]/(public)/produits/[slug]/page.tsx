import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getProductBySlug } from "@/lib/api/content"
import { ProductDetail } from "@/components/products/product-detail"
import { pickField } from "@/lib/i18n-field"

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

// Rendu à la demande (données dynamiques du backend, pas de pré-rendu au build).
export const dynamic = "force-dynamic"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://foodforlifedrc.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Produit" }

  const description = pickField(product, "tagline", locale as "fr" | "en")
  const url = `${siteUrl}/${locale}/produits/${slug}`

  return {
    title: product.name,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${siteUrl}/fr/produits/${slug}`,
        en: `${siteUrl}/en/produits/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, locale } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: pickField(product, "description", locale as "fr" | "en"),
    image: product.imageUrl ? `${siteUrl}${product.imageUrl}` : undefined,
    brand: { "@type": "Brand", name: "Food For Life" },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  )
}
