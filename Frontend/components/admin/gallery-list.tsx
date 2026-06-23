"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { Play, ImageIcon } from "lucide-react"

import { getGallery } from "@/lib/api/content"
import {
  deleteGalleryItem,
  createGalleryItem,
  updateGalleryItem,
} from "@/lib/api/admin"
import { useRowDelete } from "@/components/admin/use-row-delete"
import {
  AdminFormDialog,
  type FieldDef,
} from "@/components/admin/admin-form-dialog"
import { useEntityForm } from "@/components/admin/use-entity-form"
import { pick } from "@/lib/i18n-field"
import type { GalleryItem, Locale } from "@/lib/types"
import {
  TableCard,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  EmptyRow,
} from "@/components/admin/admin-table"
import { AdminToolbar, FilterPills } from "@/components/admin/admin-toolbar"
import { RowActions } from "@/components/admin/row-actions"
import { TableSkeleton } from "@/components/admin/table-skeleton"

const categories = ["all", "terrain", "produits", "evenements", "equipe"] as const

export function GalleryList() {
  const t = useTranslations("adminUI")
  const tg = useTranslations("gallery")
  const locale = useLocale() as Locale
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: getGallery,
  })

  const del = useRowDelete(deleteGalleryItem, ["gallery"])

  const form = useEntityForm<GalleryItem>({
    create: (v) => createGalleryItem(v as Partial<GalleryItem>),
    update: (id, v) => updateGalleryItem(id, v as Partial<GalleryItem>),
    queryKey: ["gallery"],
  })

  const fields: FieldDef[] = [
    { name: "titleFr", label: `${t("title")} (FR)`, type: "text" },
    { name: "titleEn", label: `${t("title")} (EN)`, type: "text" },
    {
      name: "category",
      label: t("category"),
      type: "select",
      options: ["terrain", "produits", "evenements", "equipe"].map((c) => ({
        value: c,
        label: tg(c),
      })),
    },
    {
      name: "type",
      label: t("mediaType"),
      type: "select",
      options: [
        { value: "image", label: t("image") },
        { value: "video", label: t("video") },
      ],
    },
    { name: "captionFr", label: `${t("caption")} (FR)`, type: "text" },
    { name: "captionEn", label: `${t("caption")} (EN)`, type: "text" },
    { name: "videoUrl", label: t("videoUrl"), type: "text" },
    { name: "order", label: t("order"), type: "number" },
    { name: "imageUrl", label: t("image"), type: "image" },
  ]

  const rows = useMemo(() => {
    return (data ?? [])
      .filter((g) => {
        const title = pick(g, "title", locale).toLowerCase()
        const matchSearch = title.includes(search.toLowerCase())
        const matchCat = category === "all" || g.category === category
        return matchSearch && matchCat
      })
      .sort((a, b) => a.order - b.order)
  }, [data, search, category, locale])

  return (
    <div className="grid gap-4">
      <AdminToolbar
        search={search}
        onSearch={setSearch}
        onAdd={form.openCreate}
        filters={
          <FilterPills
            options={categories.map((c) => ({
              value: c,
              label: c === "all" ? t("filterAll") : tg(c),
            }))}
            active={category}
            onChange={setCategory}
          />
        }
      />

      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : (
        <TableCard>
          <Thead>
            <Tr>
              <Th>{t("title")}</Th>
              <Th>{t("category")}</Th>
              <Th>{t("type")}</Th>
              <Th className="text-right">{t("actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.length === 0 ? (
              <EmptyRow colSpan={4} label={t("noResults")} />
            ) : (
              rows.map((g) => (
                <Tr key={g.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        <Image
                          src={g.imageUrl || "/placeholder.svg"}
                          alt={pick(g, "title", locale)}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                      <span className="font-medium text-ink">
                        {pick(g, "title", locale)}
                      </span>
                    </div>
                  </Td>
                  <Td className="text-ink-muted">{tg(g.category)}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-1.5 text-ink-muted">
                      {g.type === "video" ? (
                        <Play className="size-3.5" />
                      ) : (
                        <ImageIcon className="size-3.5" />
                      )}
                      {t(g.type === "video" ? "video" : "image")}
                    </span>
                  </Td>
                  <Td>
                    <RowActions
                      onEdit={() => form.openEdit(g)}
                      onDelete={() => del.mutate(g.id)}
                      deleting={del.isPending && del.variables === g.id}
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </TableCard>
      )}

      <AdminFormDialog
        open={form.open}
        onOpenChange={form.setOpen}
        title={form.editing ? t("editTitle") : t("createTitle")}
        fields={fields}
        initial={form.editing as Record<string, unknown> | null}
        onSubmit={form.submit}
        submitting={form.submitting}
      />
    </div>
  )
}
