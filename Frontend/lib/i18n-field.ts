import type { Locale } from "@/lib/types"

/**
 * Picks the localized value from a bilingual entity.
 * pick(article, "title", locale) -> article.titleFr | article.titleEn
 */
export function pick(entity: object, base: string, locale: Locale): string {
  const suffix = locale === "en" ? "En" : "Fr"
  const value = (entity as Record<string, unknown>)[`${base}${suffix}`]
  return typeof value === "string" ? value : ""
}

// Alias explicite (utilisé côté SEO/métadonnées).
export const pickField = pick

export function pickArray(
  entity: object,
  base: string,
  locale: Locale
): string[] {
  const suffix = locale === "en" ? "En" : "Fr"
  const value = (entity as Record<string, unknown>)[`${base}${suffix}`]
  return Array.isArray(value) ? (value as string[]) : []
}
