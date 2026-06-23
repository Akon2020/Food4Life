"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { getAdminArticles, deleteArticle } from "@/lib/api/admin"
import { useRowDelete } from "@/components/admin/use-row-delete"
import { pick } from "@/lib/i18n-field"
import { formatDate } from "@/lib/format"
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
import { StatusBadge, statusTone } from "@/components/admin/status-badge"
import { AdminToolbar, FilterPills } from "@/components/admin/admin-toolbar"
import { RowActions } from "@/components/admin/row-actions"
import { TableSkeleton } from "@/components/admin/table-skeleton"

const categories = ["all", "impact", "evenement", "presse"] as const

export function ArticlesList() {
  const t = useTranslations("adminUI")
  const tc = useTranslations("blog")
  const locale = useLocale() as Locale
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: getAdminArticles,
  })

  const del = useRowDelete(deleteArticle, ["admin", "articles"])

  const rows = useMemo(() => {
    return (data ?? []).filter((a) => {
      const title = pick(a, "title", locale).toLowerCase()
      const matchSearch = title.includes(search.toLowerCase())
      const matchCat = category === "all" || a.category === category
      return matchSearch && matchCat
    })
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
              label: c === "all" ? t("filterAll") : tc(c),
            }))}
            active={category}
            onChange={setCategory}
          />
        }
      />

      {isLoading ? (
        <TableSkeleton columns={5} />
      ) : (
        <TableCard>
          <Thead>
            <Tr>
              <Th>{t("title")}</Th>
              <Th>{t("category")}</Th>
              <Th>{t("status")}</Th>
              <Th>{t("date")}</Th>
              <Th className="text-right">{t("actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.length === 0 ? (
              <EmptyRow colSpan={5} label={t("noResults")} />
            ) : (
              rows.map((a) => (
                <Tr key={a.id}>
                  <Td className="font-medium text-ink">{pick(a, "title", locale)}</Td>
                  <Td className="text-ink-muted">{tc(a.category)}</Td>
                  <Td>
                    <StatusBadge
                      label={t(a.status === "published" ? "published" : "draft")}
                      tone={statusTone(a.status)}
                    />
                  </Td>
                  <Td className="whitespace-nowrap text-ink-muted">
                    {a.publishedAt ? formatDate(a.publishedAt, locale) : "—"}
                  </Td>
                  <Td>
                    <RowActions
                      viewHref={`/actualites/${a.slug}`}
                      onDelete={() => del.mutate(a.id)}
                      deleting={del.isPending && del.variables === a.id}
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
