"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { ArrowUpRight } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"
import type { Locale } from "@/i18n/routing"
import { formatDate } from "@/lib/format"

function CategoryTag({ label }: { label: string }) {
  return (
    <Badge className="rounded-full bg-green-100 px-2.5 py-0.5 font-medium capitalize text-green-800 hover:bg-green-100">
      {label}
    </Badge>
  )
}

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article
  featured?: boolean
}) {
  const locale = useLocale() as Locale
  const t = useTranslations("blog")
  const title = locale === "fr" ? article.titleFr : article.titleEn
  const excerpt = locale === "fr" ? article.excerptFr : article.excerptEn
  const date = article.publishedAt ? formatDate(article.publishedAt, locale) : ""

  if (featured) {
    return (
      <Link
        href={`/actualites/${article.slug}`}
        className="group grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-100 shadow-sm">
          <Image
            src={article.coverImageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <CategoryTag label={t(article.category)} />
            {date ? <time className="text-ink-muted">{date}</time> : null}
          </div>
          <h2 className="mt-4 text-balance font-heading text-2xl font-bold leading-tight text-ink transition-colors group-hover:text-green-700 md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700">
            {locale === "en" ? "Read article" : "Lire l'article"}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/actualites/${article.slug}`} className="group flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-100 shadow-sm">
        <Image
          src={article.coverImageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <CategoryTag label={t(article.category)} />
          {date ? <time className="text-ink-muted">{date}</time> : null}
        </div>
        <h3 className="mt-3 text-balance font-heading text-lg font-bold leading-snug text-ink transition-colors group-hover:text-green-700">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
      </div>
    </Link>
  )
}
