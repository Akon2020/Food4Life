"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { ArrowLeft, Check, Users, CalendarClock } from "lucide-react"

import type { Locale, Product } from "@/lib/types"
import { Link } from "@/i18n/navigation"
import { pick, pickArray } from "@/lib/i18n-field"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/motion/reveal"

// Coercion défensive : un champ JSON peut arriver en tableau OU en chaîne selon la base.
function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[]
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  }
  return []
}

export function ProductDetail({ product }: { product: Product }) {
  const locale = useLocale() as Locale
  const t = useTranslations("products")
  const tc = useTranslations("common")
  const available = product.status === "available"
  const ingredients = toStringArray(product.ingredients)

  return (
    <article className="bg-background pb-24">
      <div className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {t("backToProducts")}
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 lg:grid-cols-2 lg:py-16">
        <Reveal>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border shadow-lg">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <span
              className={cn(
                "absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-semibold",
                available ? "bg-primary text-primary-foreground" : "bg-gold-500 text-ink"
              )}
            >
              {available ? tc("available") : tc("comingSoon")}
            </span>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal>
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-lg font-medium text-primary">
              {pick(product, "tagline", locale)}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {pick(product, "description", locale)}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {t("ingredients")}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {t("benefits")}
              </h2>
              <ul className="mt-3 grid gap-2">
                {pickArray(product, "benefits", locale).map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Users className="size-4" />
                  <h3 className="text-sm font-semibold text-foreground">{t("audience")}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pick(product, "targetAudience", locale)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <CalendarClock className="size-4" />
                  <h3 className="text-sm font-semibold text-foreground">{t("availability")}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pick(product, "availability", locale)}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  )
}
