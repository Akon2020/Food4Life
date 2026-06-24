"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Package } from "lucide-react"

import { getProducts } from "@/lib/api/content"
import { ProductCard } from "@/components/products/product-card"
import { StaggerGroup } from "@/components/motion/reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/site/empty-state"

export function ProductsGrid() {
  const t = useTranslations("products")
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: getProducts })
  const products = data ?? []

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState icon={Package} title={t("emptyTitle")} message={t("empty")} />
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  )
}
