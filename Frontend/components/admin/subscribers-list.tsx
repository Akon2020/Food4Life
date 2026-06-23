"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { Mail, CheckCircle2, Clock } from "lucide-react"

import { getAdminSubscribers } from "@/lib/api/admin"
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
import { AdminToolbar } from "@/components/admin/admin-toolbar"
import { StatCard } from "@/components/admin/stat-card"
import { TableSkeleton } from "@/components/admin/table-skeleton"

export function SubscribersList() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: getAdminSubscribers,
  })

  const all = data ?? []
  const confirmed = all.filter((s) => s.confirmed).length

  const rows = useMemo(() => {
    return all
      .filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [all, search])

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t("totalSubscribers")} value={all.length} icon={Mail} accent="green" />
        <StatCard label={t("confirmedCount")} value={confirmed} icon={CheckCircle2} accent="blue" />
        <StatCard
          label={t("pendingCount")}
          value={all.length - confirmed}
          icon={Clock}
          accent="gold"
        />
      </div>

      <div className="grid gap-4">
        <AdminToolbar search={search} onSearch={setSearch} showAdd={false} />

        {isLoading ? (
          <TableSkeleton columns={3} />
        ) : (
          <TableCard>
            <Thead>
              <Tr>
                <Th>{t("email")}</Th>
                <Th>{t("locale")}</Th>
                <Th>{t("status")}</Th>
                <Th>{t("date")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.length === 0 ? (
                <EmptyRow colSpan={4} label={t("noResults")} />
              ) : (
                rows.map((s) => (
                  <Tr key={s.id}>
                    <Td className="font-medium text-ink">{s.email}</Td>
                    <Td className="uppercase text-ink-muted">{s.locale}</Td>
                    <Td>
                      <StatusBadge
                        label={t(s.confirmed ? "confirmed" : "pending")}
                        tone={statusTone(s.confirmed ? "confirmed" : "pending")}
                      />
                    </Td>
                    <Td className="whitespace-nowrap text-ink-muted">
                      {formatDate(s.createdAt, locale)}
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </TableCard>
        )}
      </div>
    </div>
  )
}
