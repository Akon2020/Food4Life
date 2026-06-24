"use client"

import { useTranslations, useLocale } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import {
  Newspaper,
  Package,
  Users,
  Inbox,
  Mail,
  Send,
  ArrowRight,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

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

const GREEN = "#1b6b2e"
const GOLD = "#f4b400"
const PIE_COLORS = ["#1b6b2e", "#f4b400", "#5dbb46"]

function monthLabel(ym: string, locale: string): string {
  const [y, m] = ym.split("-").map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString(
    locale === "en" ? "en-US" : "fr-FR",
    { month: "short" }
  )
}

const chartCard =
  "rounded-xl border border-border bg-card p-5"

export function DashboardOverview() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getDashboard,
  })

  if (isLoading || !data) {
    return <TableSkeleton columns={3} rows={5} />
  }

  const c = data.counts
  const stats = [
    { key: "statArticles", icon: Newspaper, value: c.articles, href: "/admin/actualites" },
    { key: "statProducts", icon: Package, value: c.products, href: "/admin/produits" },
    { key: "statSubscribers", icon: Mail, value: c.subscribers, href: "/admin/newsletter" },
    { key: "statMessages", icon: Inbox, value: c.messages, href: "/admin/messages" },
    { key: "statCampaigns", icon: Send, value: c.campaigns, href: "/admin/campagnes" },
    { key: "statUsers", icon: Users, value: c.users, href: "/admin/utilisateurs" },
  ] as const

  const activity = data.monthly.map((m) => ({
    month: monthLabel(m.month, locale),
    messages: m.messages,
    subscribers: m.subscribers,
  }))

  const content = [
    { name: t("statProducts"), value: data.contentDistribution.products },
    { name: t("statArticles"), value: data.contentDistribution.articles },
    { name: t("statPartners"), value: data.contentDistribution.partners },
    { name: t("statTeam"), value: data.contentDistribution.team },
    { name: t("testimonials"), value: data.contentDistribution.testimonials },
    { name: t("gallery"), value: data.contentDistribution.gallery },
  ]

  const byType = [
    { name: t("typeContact"), value: data.messagesByType.contact },
    { name: t("typePartenariat"), value: data.messagesByType.partenariat },
    { name: t("typeCandidature"), value: data.messagesByType.candidature },
  ].filter((d) => d.value > 0)

  return (
    <div className="grid gap-6">
      {/* Cartes de stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.key} label={t(s.key)} value={s.value} icon={s.icon} href={s.href} />
        ))}
      </div>

      {/* Graphiques : activité + répartition */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${chartCard} lg:col-span-2`}>
          <h2 className="mb-4 font-heading text-base font-semibold text-ink">
            {t("dashboardActivity")}
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={activity} margin={{ left: -20, right: 8, top: 4 }}>
              <defs>
                <linearGradient id="gMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="messages" name={t("statMessages")} stroke={GREEN} fill="url(#gMsg)" strokeWidth={2} />
              <Area type="monotone" dataKey="subscribers" name={t("statSubscribers")} stroke={GOLD} fill="url(#gSub)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={chartCard}>
          <h2 className="mb-4 font-heading text-base font-semibold text-ink">
            {t("dashboardMessageTypes")}
          </h2>
          {byType.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {byType.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-ink-muted">{t("noMessages")}</p>
          )}
        </div>
      </div>

      {/* Répartition du contenu (barres) */}
      <div className={chartCard}>
        <h2 className="mb-4 font-heading text-base font-semibold text-ink">
          {t("dashboardContent")}
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={content} margin={{ left: -20, right: 8, top: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill={GREEN} radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables : messages + campagnes récents */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-heading text-base font-semibold text-ink">{t("recentMessages")}</h2>
            <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-900">
              {t("view")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {data.recentMessages.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-muted">{t("noMessages")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentMessages.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{m.name}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {t(messageTypeKey[m.type] ?? "typeContact")} · {m.message}
                    </p>
                  </div>
                  <StatusBadge label={t(messageStatusKey[m.status] ?? "msgNew")} tone={statusTone(m.status)} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-heading text-base font-semibold text-ink">{t("recentCampaigns")}</h2>
            <Link href="/admin/campagnes" className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-900">
              {t("view")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {data.recentCampaigns.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-muted">{t("noCampaigns")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentCampaigns.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{c.subject}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {c.sentAt ? formatDate(c.sentAt, locale) : "—"}
                    </p>
                  </div>
                  <Link href={`/admin/campagnes/${c.id}`} className="text-sm font-medium text-green-700 hover:text-green-900">
                    {t("view")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
