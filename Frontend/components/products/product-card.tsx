"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import type { Locale, Product } from "@/lib/types"
import { Link } from "@/i18n/navigation"
import { pick } from "@/lib/i18n-field"
import { cn } from "@/lib/utils"
import { fadeUp } from "@/components/motion/reveal"

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as Locale
  const t = useTranslations("common")

  const available = product.status === "available"

  return (
    <motion.article variants={fadeUp} whileHover={{ y: -6 }}>
      <Link
        href={`/produits/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200 bg-paper shadow-sm transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-green-50">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold",
              available
                ? "bg-primary text-primary-foreground"
                : "bg-gold-500 text-ink"
            )}
          >
            {available ? t("available") : t("comingSoon")}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-heading text-xl font-bold text-foreground">
            {product.name}
          </h3>
          <p className="mt-2 flex-1 text-pretty leading-relaxed text-muted-foreground">
            {pick(product, "tagline", locale)}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700">
            {t("learnMore")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
