"use client"

import Image from "next/image"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"
import type { Locale } from "@/i18n/routing"
import { formatDate } from "@/lib/format"

export function ArticleCard({ article }: { article: Article }) {
  const locale = useLocale() as Locale
  const title = locale === "fr" ? article.titleFr : article.titleEn
  const excerpt = locale === "fr" ? article.excerptFr : article.excerptEn

  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.coverImageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground capitalize">
          {article.category}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <time className="text-xs text-muted-foreground">
          {article.publishedAt ? formatDate(article.publishedAt, locale) : ""}
        </time>
        <h3 className="mt-2 text-balance font-heading text-lg font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
      </div>
    </Link>
  )
}
