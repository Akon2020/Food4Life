import type { Locale } from "@/lib/types"

/**
 * Picks the localized value from a bilingual entity.
 * pick(article, "title", locale) -> article.titleFr | article.titleEn
 */
export function pick<T extends Record<string, unknown>>(
  entity: T,
  base: string,
  locale: Locale
): string {
  const suffix = locale === "en" ? "En" : "Fr"
  const value = entity[`${base}${suffix}`]
  return typeof value === "string" ? value : ""
}

export function pickArray<T extends Record<string, unknown>>(
  entity: T,
  base: string,
  locale: Locale
): string[] {
  const suffix = locale === "en" ? "En" : "Fr"
  const value = entity[`${base}${suffix}`]
  return Array.isArray(value) ? (value as string[]) : []
}
