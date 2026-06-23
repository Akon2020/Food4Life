import { apiGet, apiSend } from "./client"
import { mockMessages, mockSubscribers } from "@/lib/mock-data/messages"
import { mockArticles } from "@/lib/mock-data/articles"
import type {
  Article,
  ContactMessage,
  GalleryItem,
  MessageStatus,
  NewsletterSubscriber,
  Partner,
  Product,
  SiteSetting,
  TeamMember,
  Testimonial,
} from "@/lib/types"

// ---- Reads ----

// Admin variant: returns ALL articles (drafts + published), newest first.
export function getAdminArticles(): Promise<Article[]> {
  return apiGet("/admin/articles", () =>
    [...mockArticles].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )
}

export function getAdminArticle(id: string): Promise<Article> {
  return apiGet(`/admin/articles/${id}`, () => {
    const a = mockArticles.find((x) => x.id === id)
    if (!a) throw new Error("Article introuvable")
    return a
  })
}

export function getAdminMessages(): Promise<ContactMessage[]> {
  return apiGet("/admin/messages", () =>
    [...mockMessages].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )
}

export function getAdminSubscribers(): Promise<NewsletterSubscriber[]> {
  return apiGet("/admin/subscribers", () =>
    [...mockSubscribers].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )
}

export interface DashboardData {
  counts: {
    products: number
    articles: number
    publishedArticles: number
    partners: number
    team: number
    testimonials: number
    gallery: number
    messages: number
    newMessages: number
    subscribers: number
  }
  recentMessages: ContactMessage[]
}

export function getDashboard(): Promise<DashboardData> {
  return apiGet("/admin/dashboard", () => ({
    counts: {
      products: 0,
      articles: 0,
      publishedArticles: 0,
      partners: 0,
      team: 0,
      testimonials: 0,
      gallery: 0,
      messages: mockMessages.length,
      newMessages: mockMessages.filter((m) => m.status === "new").length,
      subscribers: mockSubscribers.length,
    },
    recentMessages: [...mockMessages].slice(0, 5),
  }))
}

export function getAdminSettings(): Promise<SiteSetting> {
  return apiGet("/admin/settings", async () => {
    const { mockSettings } = await import("@/lib/mock-data/settings")
    return mockSettings
  })
}

// ---- Generic mutation helpers ----

type Input<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>

export interface DeleteResult {
  ok: true
  id: string
}

function createEntity<T>(resource: string, payload: Input<T>): Promise<T> {
  return apiSend<T, Input<T>>(
    `/admin/${resource}`,
    payload,
    (b) => ({ id: `mock-${Math.random().toString(36).slice(2, 10)}`, ...b }) as T,
    "POST"
  )
}

function updateEntity<T>(
  resource: string,
  id: string,
  payload: Input<T>
): Promise<T> {
  return apiSend<T, Input<T>>(
    `/admin/${resource}/${id}`,
    payload,
    (b) => ({ id, ...b }) as T,
    "PUT"
  )
}

function deleteEntity(resource: string, id: string): Promise<DeleteResult> {
  return apiSend<DeleteResult, Record<string, never>>(
    `/admin/${resource}/${id}`,
    {},
    () => ({ ok: true, id }),
    "DELETE"
  )
}

// ---- Articles ----
export const createArticle = (p: Input<Article>) => createEntity<Article>("articles", p)
export const updateArticle = (id: string, p: Input<Article>) => updateEntity<Article>("articles", id, p)
export const deleteArticle = (id: string) => deleteEntity("articles", id)

// ---- Products ----
export const createProduct = (p: Input<Product>) => createEntity<Product>("products", p)
export const updateProduct = (id: string, p: Input<Product>) => updateEntity<Product>("products", id, p)
export const deleteProduct = (id: string) => deleteEntity("products", id)

// ---- Partners ----
export const createPartner = (p: Input<Partner>) => createEntity<Partner>("partners", p)
export const updatePartner = (id: string, p: Input<Partner>) => updateEntity<Partner>("partners", id, p)
export const deletePartner = (id: string) => deleteEntity("partners", id)

// ---- Team ----
export const createTeamMember = (p: Input<TeamMember>) => createEntity<TeamMember>("team", p)
export const updateTeamMember = (id: string, p: Input<TeamMember>) => updateEntity<TeamMember>("team", id, p)
export const deleteTeamMember = (id: string) => deleteEntity("team", id)

// ---- Testimonials ----
export const createTestimonial = (p: Input<Testimonial>) => createEntity<Testimonial>("testimonials", p)
export const updateTestimonial = (id: string, p: Input<Testimonial>) => updateEntity<Testimonial>("testimonials", id, p)
export const deleteTestimonial = (id: string) => deleteEntity("testimonials", id)

// ---- Gallery ----
export const createGalleryItem = (p: Input<GalleryItem>) => createEntity<GalleryItem>("gallery", p)
export const updateGalleryItem = (id: string, p: Input<GalleryItem>) => updateEntity<GalleryItem>("gallery", id, p)
export const deleteGalleryItem = (id: string) => deleteEntity("gallery", id)

// ---- Messages ----
export function updateMessageStatus(
  id: string,
  status: MessageStatus
): Promise<ContactMessage> {
  return apiSend<ContactMessage, { status: MessageStatus }>(
    `/admin/messages/${id}`,
    { status },
    (b) => ({ ...mockMessages[0], id, status: b.status }),
    "PATCH"
  )
}

export const deleteMessage = (id: string) => deleteEntity("messages", id)

// ---- Subscribers ----
export const deleteSubscriber = (id: string) => deleteEntity("subscribers", id)

// ---- Settings ----
export function updateSettings(payload: SiteSetting): Promise<SiteSetting> {
  return apiSend<SiteSetting, SiteSetting>(
    "/admin/settings",
    payload,
    (b) => b,
    "PUT"
  )
}
