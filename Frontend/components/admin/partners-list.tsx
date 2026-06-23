"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { ExternalLink } from "lucide-react"

import { getPartners } from "@/lib/api/content"
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
                    <RowActions />
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
