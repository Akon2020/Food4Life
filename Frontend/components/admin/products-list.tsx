"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { getProducts } from "@/lib/api/content"
import { deleteProduct } from "@/lib/api/admin"
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
import { StatusBadge, statusTone } from "@/components/admin/status-badge"
import { AdminToolbar } from "@/components/admin/admin-toolbar"
import { RowActions } from "@/components/admin/row-actions"
import { TableSkeleton } from "@/components/admin/table-skeleton"

export function ProductsList() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale
  const [search, setSearch] = useState("")

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

  const rows = useMemo(() => {
    return (data ?? [])
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.order - b.order)
  }, [data, search])

  return (
    <div className="grid gap-4">
      <AdminToolbar search={search} onSearch={setSearch} />

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
    </div>
  )
}
