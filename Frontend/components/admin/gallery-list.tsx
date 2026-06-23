"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { Play, ImageIcon } from "lucide-react"

import { getGallery } from "@/lib/api/content"
import { deleteGalleryItem } from "@/lib/api/admin"
import { useRowDelete } from "@/components/admin/use-row-delete"
import { pick } from "@/lib/i18n-field"
import type { Locale } from "@/lib/types"
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
    </div>
  )
}
