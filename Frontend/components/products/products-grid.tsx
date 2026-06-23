"use client"

import { useQuery } from "@tanstack/react-query"

import { getProducts } from "@/lib/api/content"
import { ProductCard } from "@/components/products/product-card"
import { StaggerGroup } from "@/components/motion/reveal"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductsGrid() {
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
