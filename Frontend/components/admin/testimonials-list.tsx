"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { getTestimonials } from "@/lib/api/content"
import {
  deleteTestimonial,
  createTestimonial,
  updateTestimonial,
} from "@/lib/api/admin"
import { useRowDelete } from "@/components/admin/use-row-delete"
import {
  AdminFormDialog,
  type FieldDef,
} from "@/components/admin/admin-form-dialog"
import { useEntityForm } from "@/components/admin/use-entity-form"
import { pick } from "@/lib/i18n-field"
import type { Locale, Testimonial } from "@/lib/types"
import {
  TableCard,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  EmptyRow,
} from "@/components/admin/admin-table"
import { Quote } from "lucide-react"
import { AdminToolbar } from "@/components/admin/admin-toolbar"
import { RowActions } from "@/components/admin/row-actions"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { ListStats } from "@/components/admin/list-stats"

export function TestimonialsList() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  })

  const del = useRowDelete(deleteTestimonial, ["testimonials"])

  const form = useEntityForm<Testimonial>({
    create: (v) => createTestimonial(v as Partial<Testimonial>),
    update: (id, v) => updateTestimonial(id, v as Partial<Testimonial>),
    queryKey: ["testimonials"],
  })

  const fields: FieldDef[] = [
    { name: "authorName", label: t("authorName"), type: "text", required: true },
    { name: "authorRoleFr", label: `${t("authorRole")} (FR)`, type: "text" },
    { name: "authorRoleEn", label: `${t("authorRole")} (EN)`, type: "text" },
    { name: "quoteFr", label: `${t("quote")} (FR)`, type: "textarea" },
    { name: "quoteEn", label: `${t("quote")} (EN)`, type: "textarea" },
    { name: "order", label: t("order"), type: "number" },
    { name: "photoUrl", label: t("photo"), type: "image" },
  ]

  const rows = useMemo(() => {
    return (data ?? [])
      .filter((m) => m.authorName.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.order - b.order)
  }, [data, search])

  const stats = [
    { label: t("testimonials"), value: (data ?? []).length, icon: Quote, accent: "green" as const },
  ]

  return (
    <div className="grid gap-6">
      <ListStats items={stats} />
      <AdminToolbar search={search} onSearch={setSearch} onAdd={form.openCreate} />

      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <TableCard>
          <Thead>
            <Tr>
              <Th>{t("name")}</Th>
              <Th>{t("quote")}</Th>
              <Th>{t("order")}</Th>
              <Th className="text-right">{t("actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.length === 0 ? (
              <EmptyRow colSpan={4} label={t("noResults")} />
            ) : (
              rows.map((m) => (
                <Tr key={m.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-stone-100">
                        <Image
                          src={m.photoUrl || "/placeholder.svg"}
                          alt={m.authorName}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{m.authorName}</p>
                        <p className="truncate text-xs text-ink-muted">
                          {pick(m, "authorRole", locale)}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td className="max-w-md">
                    <span className="line-clamp-2 text-ink-muted">
                      {pick(m, "quote", locale)}
                    </span>
                  </Td>
                  <Td className="text-ink-muted">{m.order}</Td>
                  <Td>
                    <RowActions
                      onEdit={() => form.openEdit(m)}
                      onDelete={() => del.mutate(m.id)}
                      deleting={del.isPending && del.variables === m.id}
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
