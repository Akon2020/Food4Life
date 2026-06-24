"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { getProducts } from "@/lib/api/content"
import { deleteProduct, createProduct, updateProduct } from "@/lib/api/admin"
import { pick } from "@/lib/i18n-field"
import type { Locale, Product } from "@/lib/types"
import {
  TableCard,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  EmptyRow,
} from "@/components/admin/admin-table"
import { Package, CheckCircle2, Clock } from "lucide-react"
import { StatusBadge, statusTone } from "@/components/admin/status-badge"
import { AdminToolbar, FilterPills } from "@/components/admin/admin-toolbar"
import { RowActions } from "@/components/admin/row-actions"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { ListStats } from "@/components/admin/list-stats"
import {
  AdminFormDialog,
  type FieldDef,
} from "@/components/admin/admin-form-dialog"
import { useEntityForm } from "@/components/admin/use-entity-form"

const STATUSES = ["all", "available", "coming_soon"] as const

export function ProductsList() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")

  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success(t("deleted"))
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: () => toast.error(t("deleteError")),
  })

  const form = useEntityForm<Product>({
    create: (v) => createProduct(v as Partial<Product>),
    update: (id, v) => updateProduct(id, v as Partial<Product>),
    queryKey: ["products"],
  })

  const fields: FieldDef[] = [
    { name: "name", label: t("name"), type: "text", required: true },
    { name: "slug", label: t("slug"), type: "text", required: true },
    {
      name: "status",
      label: t("status"),
      type: "select",
      options: [
        { value: "available", label: t("available") },
        { value: "coming_soon", label: t("comingSoon") },
      ],
    },
    { name: "order", label: t("order"), type: "number" },
    { name: "taglineFr", label: `${t("tagline")} (FR)`, type: "text" },
    { name: "taglineEn", label: `${t("tagline")} (EN)`, type: "text" },
    { name: "descriptionFr", label: `${t("description")} (FR)`, type: "textarea" },
    { name: "descriptionEn", label: `${t("description")} (EN)`, type: "textarea" },
    { name: "targetAudienceFr", label: `${t("audience")} (FR)`, type: "text" },
    { name: "targetAudienceEn", label: `${t("audience")} (EN)`, type: "text" },
    { name: "availabilityFr", label: `${t("availability")} (FR)`, type: "text" },
    { name: "availabilityEn", label: `${t("availability")} (EN)`, type: "text" },
    { name: "ingredients", label: t("ingredients"), type: "stringList" },
    { name: "benefitsFr", label: `${t("benefits")} (FR)`, type: "stringList" },
    { name: "benefitsEn", label: `${t("benefits")} (EN)`, type: "stringList" },
    { name: "imageUrl", label: t("image"), type: "image" },
    { name: "gallery", label: t("gallery"), type: "stringList" },
  ]

  const all = data ?? []
  const stats = [
    { label: t("statProducts"), value: all.length, icon: Package, accent: "green" as const },
    {
      label: t("available"),
      value: all.filter((p) => p.status === "available").length,
      icon: CheckCircle2,
      accent: "blue" as const,
    },
    {
      label: t("comingSoon"),
      value: all.filter((p) => p.status === "coming_soon").length,
      icon: Clock,
      accent: "gold" as const,
    },
  ]

  const rows = useMemo(() => {
    return all
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (status === "all" ? true : p.status === status))
      .sort((a, b) => a.order - b.order)
  }, [all, search, status])

  return (
    <div className="grid gap-6">
      <ListStats items={stats} />
      <AdminToolbar
        search={search}
        onSearch={setSearch}
        onAdd={form.openCreate}
        filters={
          <FilterPills
            options={STATUSES.map((s) => ({
              value: s,
              label:
                s === "all"
                  ? t("filterAll")
                  : s === "available"
                    ? t("available")
                    : t("comingSoon"),
            }))}
            active={status}
            onChange={setStatus}
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
              <Th>{t("status")}</Th>
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
                    <div className="flex items-center gap-3">
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        <Image
                          src={p.imageUrl || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{p.name}</p>
                        <p className="truncate text-xs text-ink-muted">
                          {pick(p, "tagline", locale)}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge
                      label={t(p.status === "available" ? "available" : "comingSoon")}
                      tone={statusTone(p.status)}
                    />
                  </Td>
                  <Td className="text-ink-muted">{p.order}</Td>
                  <Td>
                    <RowActions
                      viewHref={`/produits/${p.slug}`}
                      onEdit={() => form.openEdit(p)}
                      onDelete={() => removeMutation.mutate(p.id)}
                      deleting={
                        removeMutation.isPending &&
                        removeMutation.variables === p.id
                      }
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
