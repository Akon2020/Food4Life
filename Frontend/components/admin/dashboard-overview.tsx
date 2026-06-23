"use client"

import { useTranslations, useLocale } from "next-intl"
import { useQueries } from "@tanstack/react-query"
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
import {
  getArticles,
  getProducts,
  getPartners,
  getTeam,
} from "@/lib/api/content"
import { getAdminMessages, getAdminSubscribers } from "@/lib/api/admin"
import { formatDate } from "@/lib/format"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge, statusTone } from "@/components/admin/status-badge"

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
  const locale = useLocale()

  const results = useQueries({
    queries: [
      { queryKey: ["articles", "all"], queryFn: () => getArticles() },
      { queryKey: ["products"], queryFn: getProducts },
      { queryKey: ["partners"], queryFn: getPartners },
      { queryKey: ["team"], queryFn: getTeam },
      { queryKey: ["admin", "messages"], queryFn: getAdminMessages },
      { queryKey: ["admin", "subscribers"], queryFn: getAdminSubscribers },
    ],
  })

  const [articles, products, partners, team, messages, subscribers] = results.map(
    (r) => r.data
  )

  const stats = [
    { key: "statArticles", icon: Newspaper, value: articles?.length, href: "/admin/actualites" },
    { key: "statProducts", icon: Package, value: products?.length, href: "/admin/produits" },
    { key: "statPartners", icon: Handshake, value: partners?.length, href: "/admin/partenaires" },
    { key: "statTeam", icon: Users, value: team?.length, href: "/admin/equipe" },
    { key: "statMessages", icon: Inbox, value: messages?.length, href: "/admin/messages" },
    { key: "statSubscribers", icon: Mail, value: subscribers?.length, href: "/admin/newsletter" },
  ] as const

  const recent = [...(messages ?? [])]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

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
