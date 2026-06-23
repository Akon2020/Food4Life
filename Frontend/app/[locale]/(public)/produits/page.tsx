import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHero } from "@/components/site/page-hero"
import { ProductsGrid } from "@/components/products/products-grid"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("products")
  return { title: t("title"), description: t("subtitle") }
}

export default async function ProductsPage() {
  const t = await getTranslations("products")
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <ProductsGrid />
    </>
  )
}
