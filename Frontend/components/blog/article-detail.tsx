"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { ArrowLeft, CalendarDays, Clock } from "lucide-react"

import type { Article, Locale } from "@/lib/types"
import { Link } from "@/i18n/navigation"
import { pick } from "@/lib/i18n-field"
import { formatDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Reveal } from "@/components/motion/reveal"
import { ShareButtons } from "@/components/blog/share-buttons"

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ")
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function ArticleDetail({ article }: { article: Article }) {
  const t = useTranslations("blog")
  const locale = useLocale() as Locale

  const title = pick(article, "title", locale)
  const excerpt = pick(article, "excerpt", locale)
  const body = pick(article, "body", locale)
  // Contenu de l'éditeur riche = HTML (sanitisé backend) ; ancien contenu = texte brut.
  const isHtml = /<[a-z][\s\S]*>/i.test(body)
  const paragraphs = body.split(/\n\s*\n/).filter(Boolean)
  const minutes = readingTime(body)

  return (
    <article className="bg-background pb-24">
      {/* Hero */}
      <header className="relative h-[48vh] min-h-[22rem] w-full overflow-hidden">
        <Image
          src={article.coverImageUrl || "/placeholder.svg"}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-3xl px-4 pb-10">
            <Badge className="bg-accent capitalize text-accent-foreground">
              {t(article.category)}
            </Badge>
            <h1 className="mt-4 text-balance font-heading text-3xl font-bold leading-tight text-paper md:text-5xl">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper/80">
              {article.publishedAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {formatDate(article.publishedAt, locale)}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                {minutes} {locale === "en" ? "min read" : "min de lecture"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4">
        {/* Barre : retour + partage */}
        <div className="flex flex-col gap-4 border-b border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {t("backToBlog")}
          </Link>
          <ShareButtons title={title} />
        </div>

        <Reveal>
          {/* Chapeau */}
          {excerpt ? (
            <p className="mt-8 border-l-4 border-gold-400 pl-4 text-lg font-medium leading-relaxed text-foreground">
              {excerpt}
            </p>
          ) : null}

          {/* Corps */}
          {isHtml ? (
            <div
              className="ffl-prose mt-8 text-base leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : (
            <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-foreground">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </Reveal>

        {/* Pied : partage + retour */}
        <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-base font-semibold text-ink">
              {locale === "en"
                ? "Found this useful? Share it."
                : "Cet article vous a plu ? Partagez-le."}
            </p>
            <p className="text-sm text-ink-muted">
              {locale === "en"
                ? "Help us spread the word about Food For Life."
                : "Aidez-nous à faire connaître Food For Life."}
            </p>
          </div>
          <ShareButtons title={title} />
        </div>
      </div>
    </article>
  )
}
