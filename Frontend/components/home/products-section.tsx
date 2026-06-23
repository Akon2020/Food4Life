"use client"

import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"

import { getProducts } from "@/lib/api/content"
import { SectionHeading } from "@/components/site/section-heading"
import { StaggerGroup } from "@/components/motion/reveal"
import { ProductCard } from "@/components/products/product-card"
import { LinkButton } from "@/components/site/link-button"

export function HomeProductsSection() {
  const t = useTranslations("home")
  const tc = useTranslations("common")
  const { data } = useQuery({ queryKey: ["products"], queryFn: getProducts })
  const products = data ?? []

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("productsEyebrow")}
          title={t("productsTitle")}
          description={t("productsText")}
        />
        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerGroup>
        <div className="mt-12 flex justify-center">
          <LinkButton href="/produits" variant="outline" size="lg">
            {tc("viewAll")}
            <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
