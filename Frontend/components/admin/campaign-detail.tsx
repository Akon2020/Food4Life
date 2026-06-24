"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { getCampaign } from "@/lib/api/admin"
import type { Locale } from "@/lib/types"
import { formatDateTime } from "@/lib/format"
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
import { TableSkeleton } from "@/components/admin/table-skeleton"

export function CampaignDetail({ campaignId }: { campaignId: string }) {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "campaign", campaignId],
    queryFn: () => getCampaign(campaignId),
  })

  if (isLoading || !data) {
    return <TableSkeleton columns={3} rows={5} />
  }

  return (
    <div className="grid gap-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        {t("cancel")}
      </button>

      <section className="rounded-xl border border-border bg-card p-6">
        <h1 className="font-heading text-xl font-bold text-ink">{data.subject}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {t("sentAt")} : {data.sentAt ? formatDateTime(data.sentAt, locale) : "—"} ·{" "}
          {t("sentCount")} : {data.sentCount ?? 0}/{data.recipientCount ?? 0}
        </p>
        <div
          className="ffl-prose mt-5 border-t border-border pt-5 text-sm text-ink"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </section>

      <section className="grid gap-3">
        <h2 className="font-heading text-lg font-semibold text-ink">
          {t("recipients")}
        </h2>
        <TableCard>
          <Thead>
            <Tr>
              <Th>{t("name")}</Th>
              <Th>{t("status")}</Th>
              <Th>{t("sentAt")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(data.recipients ?? []).length === 0 ? (
              <EmptyRow colSpan={3} label={t("noResults")} />
            ) : (
              (data.recipients ?? []).map((r) => (
                <Tr key={r.id}>
                  <Td>
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{r.name ?? "—"}</p>
                      <p className="truncate text-xs text-ink-muted">{r.email}</p>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge label={r.status} tone={statusTone(r.status)} />
                  </Td>
                  <Td className="whitespace-nowrap text-ink-muted">
                    {r.sentAt ? formatDateTime(r.sentAt, locale) : "—"}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </TableCard>
      </section>
    </div>
  )
}
