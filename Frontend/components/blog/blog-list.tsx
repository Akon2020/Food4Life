"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"

import type { ArticleCategory } from "@/lib/types"
import { getArticles } from "@/lib/api/content"
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
  const [filter, setFilter] = useState<ArticleCategory | "all">("all")

  const { data, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  })
  const articles = useMemo(
    () =>
      (data ?? []).filter((a) =>
        filter === "all" ? true : a.category === filter
      ),
    [data, filter]
  )

  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Filtres */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              )}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <>
            {/* À la une */}
            {featured ? (
              <div className="mb-14 border-b border-border pb-14">
                <ArticleCard article={featured} featured />
              </div>
            ) : null}

            {/* Grille */}
            {rest.length > 0 ? (
              <StaggerGroup className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
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
