"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { ExternalLink } from "lucide-react"

import { getPartners } from "@/lib/api/content"
import { deletePartner, createPartner, updatePartner } from "@/lib/api/admin"
import { useRowDelete } from "@/components/admin/use-row-delete"
import {
  AdminFormDialog,
  type FieldDef,
} from "@/components/admin/admin-form-dialog"
import { useEntityForm } from "@/components/admin/use-entity-form"
import type { Partner } from "@/lib/types"
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

const categories = [
  "all",
  "financier",
  "technique",
  "formation",
  "institutionnel",
] as const

export function PartnersList() {
  const t = useTranslations("adminUI")
  const tp = useTranslations("partners")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: getPartners,
  })

  const del = useRowDelete(deletePartner, ["partners"])

  const form = useEntityForm<Partner>({
    create: (v) => createPartner(v as Partial<Partner>),
    update: (id, v) => updatePartner(id, v as Partial<Partner>),
    queryKey: ["partners"],
  })

  const fields: FieldDef[] = [
    { name: "name", label: t("name"), type: "text", required: true },
    {
      name: "category",
      label: t("category"),
      type: "select",
      options: ["financier", "technique", "formation", "institutionnel"].map(
        (c) => ({ value: c, label: tp(c) })
      ),
    },
    { name: "order", label: t("order"), type: "number" },
    { name: "websiteUrl", label: t("website"), type: "text" },
    { name: "descriptionFr", label: `${t("description")} (FR)`, type: "textarea" },
    { name: "descriptionEn", label: `${t("description")} (EN)`, type: "textarea" },
    { name: "logoUrl", label: t("logo"), type: "image" },
  ]

  const rows = useMemo(() => {
    return (data ?? [])
      .filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === "all" || p.category === category
        return matchSearch && matchCat
      })
      .sort((a, b) => a.order - b.order)
  }, [data, search, category])

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
              label: c === "all" ? t("filterAll") : tp(c),
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
              <Th>{t("name")}</Th>
              <Th>{t("category")}</Th>
              <Th>{t("order")}</Th>
              <Th className="text-right">{t("actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.length === 0 ? (
              <EmptyRow colSpan={4} label={t("noResults")} />
            ) : (
              rows.map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">{p.name}</span>
                      {p.websiteUrl ? (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-muted transition-colors hover:text-green-700"
                          aria-label={p.name}
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </Td>
                  <Td className="text-ink-muted">{tp(p.category)}</Td>
                  <Td className="text-ink-muted">{p.order}</Td>
                  <Td>
                    <RowActions
                      onEdit={() => form.openEdit(p)}
                      onDelete={() => del.mutate(p.id)}
                      deleting={del.isPending && del.variables === p.id}
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
