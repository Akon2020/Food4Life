"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { Plus } from "lucide-react"

import { getCampaigns, deleteCampaign } from "@/lib/api/admin"
import type { Locale } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { useRouter } from "@/i18n/navigation"
import {
  TableCard,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  EmptyRow,
} from "@/components/admin/admin-table"
import { RowActions } from "@/components/admin/row-actions"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { useRowDelete } from "@/components/admin/use-row-delete"

export function CampaignsList() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "campaigns"],
    queryFn: getCampaigns,
  })
  const del = useRowDelete(deleteCampaign, ["admin", "campaigns"])

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-ink">
          {t("campaigns")}
        </h2>
        <button
          type="button"
          onClick={() => router.push("/admin/campagnes/nouvelle")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-800"
        >
          <Plus className="size-4" />
          {t("newCampaign")}
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : (
        <TableCard>
          <Thead>
            <Tr>
              <Th>{t("subject")}</Th>
              <Th>{t("sentAt")}</Th>
              <Th>{t("recipients")}</Th>
              <Th className="text-right">{t("actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(data ?? []).length === 0 ? (
              <EmptyRow colSpan={4} label={t("noCampaigns")} />
            ) : (
              (data ?? []).map((c) => (
                <Tr key={c.id} className="cursor-pointer" onClick={() => router.push(`/admin/campagnes/${c.id}`)}>
                  <Td className="font-medium text-ink">{c.subject}</Td>
                  <Td className="whitespace-nowrap text-ink-muted">
                    {c.sentAt ? formatDate(c.sentAt, locale) : "—"}
                  </Td>
                  <Td className="text-ink-muted">
                    {c.sentCount ?? 0}/{c.recipientCount ?? 0}
                  </Td>
                  <Td>
                    <div onClick={(e) => e.stopPropagation()}>
                      <RowActions
                        onEdit={() => router.push(`/admin/campagnes/${c.id}`)}
                        onDelete={() => del.mutate(c.id)}
                        deleting={del.isPending && del.variables === c.id}
                      />
                    </div>
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
