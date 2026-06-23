import { format } from "date-fns"
import { enUS, fr } from "date-fns/locale"
import type { Locale } from "@/i18n/routing"

export function formatDate(iso: string, locale: Locale) {
  const date = new Date(iso)
  return format(date, "d MMMM yyyy", { locale: locale === "fr" ? fr : enUS })
}

export function formatDateTime(iso: string, locale: Locale) {
  const date = new Date(iso)
  return format(date, "d MMM yyyy, HH:mm", {
    locale: locale === "fr" ? fr : enUS,
  })
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(value)
}
