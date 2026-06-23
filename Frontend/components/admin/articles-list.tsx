"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import {
  getAdminArticles,
  deleteArticle,
  createArticle,
  updateArticle,
} from "@/lib/api/admin"
import { useRowDelete } from "@/components/admin/use-row-delete"
import {
  AdminFormDialog,
  type FieldDef,
} from "@/components/admin/admin-form-dialog"
import { useEntityForm } from "@/components/admin/use-entity-form"
import { pick } from "@/lib/i18n-field"
import { formatDate } from "@/lib/format"
import type { Article, Locale } from "@/lib/types"
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

  const form = useEntityForm<Article>({
    create: (v) => createArticle(v as Partial<Article>),
    update: (id, v) => updateArticle(id, v as Partial<Article>),
    queryKey: ["admin", "articles"],
  })

  const fields: FieldDef[] = [
    { name: "titleFr", label: `${t("title")} (FR)`, type: "text", required: true },
    { name: "titleEn", label: `${t("title")} (EN)`, type: "text", required: true },
    { name: "slug", label: t("slug"), type: "text" },
    {
      name: "category",
      label: t("category"),
      type: "select",
      options: [
        { value: "impact", label: tc("impact") },
        { value: "evenement", label: tc("evenement") },
        { value: "presse", label: tc("presse") },
      ],
    },
    {
      name: "status",
      label: t("status"),
      type: "select",
      options: [
        { value: "draft", label: t("draft") },
        { value: "published", label: t("published") },
      ],
    },
    { name: "excerptFr", label: `${t("excerpt")} (FR)`, type: "textarea" },
    { name: "excerptEn", label: `${t("excerpt")} (EN)`, type: "textarea" },
    { name: "bodyFr", label: `${t("body")} (FR)`, type: "textarea" },
    { name: "bodyEn", label: `${t("body")} (EN)`, type: "textarea" },
    { name: "coverImageUrl", label: t("cover"), type: "image" },
  ]

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
        onAdd={form.openCreate}
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
                      onEdit={() => form.openEdit(a)}
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
