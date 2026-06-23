"use client"

import { Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

export function RowActions({
  viewHref,
  onEdit,
  onDelete,
  deleting = false,
}: {
  viewHref?: string
  onEdit?: () => void
  onDelete?: () => void
  deleting?: boolean
}) {
  const t = useTranslations("adminUI")

  function handleDelete() {
    if (!onDelete) return
    // Confirmation simple (un dialog dédié arrivera au Goal 10 UI/UX).
    if (window.confirm(t("confirmDelete"))) onDelete()
  }

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
        onClick={onEdit}
        disabled={!onEdit}
        title={onEdit ? t("edit") : t("comingSoonAction")}
        className="inline-flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-stone-100 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <Pencil className="size-4" />
        <span className="sr-only">{t("edit")}</span>
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={!onDelete || deleting}
        title={onDelete ? t("delete") : t("comingSoonAction")}
        className="inline-flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        {deleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
        <span className="sr-only">{t("delete")}</span>
      </button>
    </div>
  )
}
