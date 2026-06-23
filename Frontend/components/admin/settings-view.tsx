"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import {
  Wheat,
  Home,
  Users,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Info,
} from "lucide-react"

import { getSettings } from "@/lib/api/content"
import { formatNumber } from "@/lib/format"
import type { Locale } from "@/lib/types"
import { TableSkeleton } from "@/components/admin/table-skeleton"

export function SettingsView() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  })

  if (isLoading || !data) {
    return <TableSkeleton columns={2} rows={4} />
  }

  const impactItems = [
    { icon: Wheat, label: t("tonnes"), value: formatNumber(data.impact.tonnesProduced, locale) },
    { icon: Home, label: t("households"), value: formatNumber(data.impact.householdsServed, locale) },
    { icon: Users, label: t("farmers"), value: formatNumber(data.impact.farmersSupported, locale) },
    { icon: Briefcase, label: t("jobs"), value: formatNumber(data.impact.jobsCreated, locale) },
  ]

  const contactItems = [
    { icon: MapPin, label: t("address"), value: data.contact.address },
    { icon: Phone, label: t("phone"), value: data.contact.phone },
    { icon: Mail, label: t("email"), value: data.contact.email },
  ]

  const socials = Object.entries(data.socials).filter(([, v]) => v)

  return (
    <div className="grid gap-6">
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>{t("backendNote")}</p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
          {t("impactSection")}
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {impactItems.map((item) => (
            <div key={item.label} className="rounded-lg bg-stone-50 p-4">
              <item.icon className="mb-2 size-5 text-green-700" />
              <p className="font-heading text-xl font-bold text-ink">{item.value}</p>
              <p className="text-xs text-ink-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
          {t("contactSection")}
        </h2>
        <dl className="grid gap-3">
          {contactItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                <item.icon className="size-4" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs text-ink-muted">{item.label}</dt>
                <dd className="text-sm font-medium text-ink">{item.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
          {t("socialsSection")}
        </h2>
        <ul className="grid gap-2">
          {socials.map(([key, value]) => (
            <li
              key={key}
              className="flex items-center justify-between gap-4 rounded-lg bg-stone-50 px-4 py-2.5"
            >
              <span className="text-sm font-medium capitalize text-ink">{key}</span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm text-green-700 hover:text-green-900"
              >
                {value}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
