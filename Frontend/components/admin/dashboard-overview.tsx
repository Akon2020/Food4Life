"use client"

import { useTranslations, useLocale } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import {
  Newspaper,
  Package,
  Handshake,
  Users,
  Inbox,
  Mail,
  ArrowRight,
} from "lucide-react"

import { Link } from "@/i18n/navigation"
import { getDashboard } from "@/lib/api/admin"
import { formatDate } from "@/lib/format"
import type { Locale } from "@/lib/types"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge, statusTone } from "@/components/admin/status-badge"
import { TableSkeleton } from "@/components/admin/table-skeleton"

const messageStatusKey: Record<string, string> = {
  new: "msgNew",
  read: "msgRead",
  archived: "msgArchived",
}

const messageTypeKey: Record<string, string> = {
  contact: "typeContact",
  partenariat: "typePartenariat",
  candidature: "typeCandidature",
}

export function DashboardOverview() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getDashboard,
  })

  const c = data?.counts
  const recent = data?.recentMessages ?? []

  const stats = [
    { key: "statArticles", icon: Newspaper, value: c?.articles, href: "/admin/actualites" },
    { key: "statProducts", icon: Package, value: c?.products, href: "/admin/produits" },
    { key: "statPartners", icon: Handshake, value: c?.partners, href: "/admin/partenaires" },
    { key: "statTeam", icon: Users, value: c?.team, href: "/admin/equipe" },
    { key: "statMessages", icon: Inbox, value: c?.messages, href: "/admin/messages" },
    { key: "statSubscribers", icon: Mail, value: c?.subscribers, href: "/admin/newsletter" },
  ] as const

  if (isLoading) {
    return <TableSkeleton columns={3} rows={4} />
  }

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard
            key={s.key}
            label={t(s.key)}
            value={s.value ?? "—"}
            icon={s.icon}
            href={s.href}
          />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-semibold text-ink">
            {t("recentMessages")}
          </h2>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-900"
          >
            {t("view")}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-muted">
            {t("noMessages")}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{m.name}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {t(messageTypeKey[m.type] ?? "typeContact")} · {m.message}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge
                    label={t(messageStatusKey[m.status] ?? "msgNew")}
                    tone={statusTone(m.status)}
                  />
                  <span className="hidden text-xs text-ink-muted sm:block">
                    {formatDate(m.createdAt, locale)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
