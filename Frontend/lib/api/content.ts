import { apiGet } from "./client"
import { mockArticles } from "@/lib/mock-data/articles"
import { mockProducts } from "@/lib/mock-data/products"
import { mockPartners } from "@/lib/mock-data/partners"
import { mockTeam } from "@/lib/mock-data/team"
import { mockTestimonials } from "@/lib/mock-data/testimonials"
import { mockGallery } from "@/lib/mock-data/gallery"
import { mockSettings } from "@/lib/mock-data/settings"
import type {
  Article,
  ArticleCategory,
  GalleryItem,
  Partner,
  Product,
  SiteSetting,
  TeamMember,
  Testimonial,
} from "@/lib/types"

// ---- Articles ----
export function getArticles(category?: ArticleCategory): Promise<Article[]> {
  const qs = category ? `?category=${category}` : ""
  return apiGet(`/articles${qs}`, () =>
    mockArticles
      .filter((a) => a.status === "published")
      .filter((a) => (category ? a.category === category : true))
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
  )
}

export function getArticleBySlug(slug: string): Promise<Article | null> {
  return apiGet(`/articles/${slug}`, () => mockArticles.find((a) => a.slug === slug) ?? null)
}

// ---- Products ----
export function getProducts(): Promise<Product[]> {
  return apiGet("/products", () =>
    [...mockProducts].sort((a, b) => a.order - b.order)
  )
}

export function getProductBySlug(slug: string): Promise<Product | null> {
  return apiGet(`/products/${slug}`, () => mockProducts.find((p) => p.slug === slug) ?? null)
}

// ---- Partners ----
export function getPartners(): Promise<Partner[]> {
  return apiGet("/partners", () =>
    [...mockPartners].sort((a, b) => a.order - b.order)
  )
}

// ---- Team ----
export function getTeam(): Promise<TeamMember[]> {
  return apiGet("/team", () => [...mockTeam].sort((a, b) => a.order - b.order))
}

// ---- Testimonials ----
export function getTestimonials(): Promise<Testimonial[]> {
  return apiGet("/testimonials", () =>
    [...mockTestimonials].sort((a, b) => a.order - b.order)
  )
}

// ---- Gallery ----
export function getGallery(): Promise<GalleryItem[]> {
  return apiGet("/gallery", () =>
    [...mockGallery].sort((a, b) => a.order - b.order)
  )
}

// ---- Settings ----
export function getSettings(): Promise<SiteSetting> {
  return apiGet("/settings", () => mockSettings)
}
