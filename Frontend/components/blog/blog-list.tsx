"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { Search, X } from "lucide-react"

import type { ArticleCategory, Locale } from "@/lib/types"
import { getArticles } from "@/lib/api/content"
import { pick } from "@/lib/i18n-field"
import { cn } from "@/lib/utils"
import { ArticleCard } from "@/components/blog/article-card"
import { StaggerGroup } from "@/components/motion/reveal"
import { Skeleton } from "@/components/ui/skeleton"

const CATEGORIES: (ArticleCategory | "all")[] = [
  "all",
  "impact",
  "evenement",
  "presse",
]

export function BlogList() {
  const t = useTranslations("blog")
  const locale = useLocale() as Locale
  const [filter, setFilter] = useState<ArticleCategory | "all">("all")
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  })

  const query = search.trim().toLowerCase()
  const articles = useMemo(() => {
    return (data ?? [])
      .filter((a) => (filter === "all" ? true : a.category === filter))
      .filter((a) => {
        if (!query) return true
        const haystack = `${pick(a, "title", locale)} ${pick(
          a,
          "excerpt",
          locale
        )}`.toLowerCase()
        return haystack.includes(query)
      })
  }, [data, filter, query, locale])

  const isFiltering = filter !== "all" || query.length > 0
  const featured = !isFiltering ? articles[0] : undefined
  const grid = featured ? articles.slice(1) : articles

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Barre de filtres : recherche + catégories */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-9 text-sm text-ink outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label={t("clear")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                )}
              >
                {t(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Compteur de résultats */}
        {!isLoading ? (
          <p className="mb-8 text-sm text-ink-muted">
            {articles.length}{" "}
            {articles.length > 1
              ? t("resultsPlural")
              : t("resultsSingular")}
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Search className="size-10 text-ink-muted/50" />
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <>
            {featured ? (
              <div className="mb-14 border-b border-border pb-14">
                <ArticleCard article={featured} featured />
              </div>
            ) : null}

            {grid.length > 0 ? (
              <StaggerGroup className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </StaggerGroup>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
