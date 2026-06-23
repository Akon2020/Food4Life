"use client"

import { Pencil, Trash2, ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

export function RowActions({ viewHref }: { viewHref?: string }) {
  const t = useTranslations("adminUI")

  return (
    <div className="flex items-center justify-end gap-1">
      {viewHref ? (
        <Link
          href={viewHref}
          title={t("view")}
          target="_blank"
          className="inline-flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-stone-100 hover:text-green-700"
        >
          <ExternalLink className="size-4" />
          <span className="sr-only">{t("view")}</span>
        </Link>
      ) : null}
      <button
        type="button"
        disabled
        title={t("comingSoonAction")}
        className="inline-flex size-8 cursor-not-allowed items-center justify-center rounded-md text-ink-muted opacity-50"
      >
        <Pencil className="size-4" />
        <span className="sr-only">{t("edit")}</span>
      </button>
      <button
        type="button"
        disabled
        title={t("comingSoonAction")}
        className="inline-flex size-8 cursor-not-allowed items-center justify-center rounded-md text-ink-muted opacity-50"
      >
        <Trash2 className="size-4" />
        <span className="sr-only">{t("delete")}</span>
      </button>
    </div>
  )
}
