import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import { routing } from "@/i18n/routing"

// Le <html>/<body> et les providers vivent dans le layout RACINE (app/layout.tsx).
// Ce layout valide la locale et l'enregistre pour le rendu statique.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return children
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
