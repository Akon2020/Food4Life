import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"
import { getProducts, getArticles } from "@/lib/api/content"

const base =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://foodforlifedrc.org"

const staticPaths = [
  "",
  "/a-propos",
  "/services",
  "/produits",
  "/galerie",
  "/partenaires",
  "/actualites",
  "/impact",
  "/contact",
  "/carrieres",
  "/mentions-legales",
  "/politique-confidentialite",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  // Pages statiques pour chaque locale
  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      })
    }
  }

  // Pages dynamiques (produits, actualités) — best-effort
  try {
    const [products, articles] = await Promise.all([
      getProducts(),
      getArticles(),
    ])
    for (const locale of routing.locales) {
      for (const p of products) {
        entries.push({
          url: `${base}/${locale}/produits/${p.slug}`,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      }
      for (const a of articles) {
        entries.push({
          url: `${base}/${locale}/actualites/${a.slug}`,
          lastModified: a.updatedAt ? new Date(a.updatedAt) : now,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      }
    }
  } catch {
    // Backend indisponible : on garde au moins les pages statiques.
  }

  return entries
}
