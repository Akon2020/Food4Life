"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { ArrowLeft } from "lucide-react"

import type { Article, Locale } from "@/lib/types"
import { Link } from "@/i18n/navigation"
import { pick } from "@/lib/i18n-field"
import { formatDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Reveal } from "@/components/motion/reveal"

export function ArticleDetail({ article }: { article: Article }) {
  const t = useTranslations("blog")
  const locale = useLocale() as Locale

  const title = pick(article, "title", locale)
  const body = pick(article, "body", locale)
  // Le contenu produit par l'éditeur riche est du HTML (sanitisé côté backend) ;
  // l'ancien contenu en texte brut est rendu en paragraphes.
  const isHtml = /<[a-z][\s\S]*>/i.test(body)
  const paragraphs = body.split(/\n\s*\n/).filter(Boolean)

  return (
    <article className="bg-background pb-24">
      <header className="relative h-[42vh] min-h-80 w-full overflow-hidden">
        <Image
          src={article.coverImageUrl || "/placeholder.svg"}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-3xl px-4 pb-10">
            <Badge className="bg-accent capitalize text-accent-foreground">
              {t(article.category)}
            </Badge>
            <h1 className="mt-4 text-balance font-heading text-3xl font-bold leading-tight text-paper md:text-4xl">
              {title}
            </h1>
            <time className="mt-3 block text-sm text-paper/80">
              {article.publishedAt
                ? `${t("publishedOn")} ${formatDate(article.publishedAt, locale)}`
                : ""}
            </time>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4">
        <div className="border-b border-border py-6">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {t("backToBlog")}
          </Link>
        </div>

        <Reveal>
          <p className="mt-8 text-lg font-medium leading-relaxed text-foreground">
            {pick(article, "excerpt", locale)}
          </p>
          {isHtml ? (
            <div
              className="ffl-prose mt-6 leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : (
            <div className="mt-6 flex flex-col gap-5 leading-relaxed text-muted-foreground">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </article>
  )
}
