import { apiGet, apiSend } from "./client"
import { mockMessages, mockSubscribers } from "@/lib/mock-data/messages"
import { mockArticles } from "@/lib/mock-data/articles"
import type {
  Article,
  Campaign,
  ContactMessage,
  GalleryItem,
  ManagedUser,
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
    confirmedSubscribers: number
    campaigns: number
    emailsSent: number
    users: number
  }
  messagesByStatus: { new: number; read: number; archived: number }
  messagesByType: {
    contact: number
    partenariat: number
    candidature: number
  }
  contentDistribution: {
    products: number
    articles: number
    partners: number
    team: number
    testimonials: number
    gallery: number
  }
  monthly: { month: string; messages: number; subscribers: number }[]
  recentMessages: ContactMessage[]
  recentCampaigns: {
    id: string
    subject: string
    status: string
    sentAt: string | null
  }[]
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
      confirmedSubscribers: mockSubscribers.filter((s) => s.confirmed).length,
      campaigns: 0,
      emailsSent: 0,
      users: 0,
    },
    messagesByStatus: {
      new: mockMessages.filter((m) => m.status === "new").length,
      read: mockMessages.filter((m) => m.status === "read").length,
      archived: mockMessages.filter((m) => m.status === "archived").length,
    },
    messagesByType: {
      contact: mockMessages.filter((m) => m.type === "contact").length,
      partenariat: mockMessages.filter((m) => m.type === "partenariat").length,
      candidature: mockMessages.filter((m) => m.type === "candidature").length,
    },
    contentDistribution: {
      products: 0,
      articles: 0,
      partners: 0,
      team: 0,
      testimonials: 0,
      gallery: 0,
    },
    monthly: [],
    recentMessages: [...mockMessages].slice(0, 5),
    recentCampaigns: [],
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

// ---- Users (gestion) ----
export function getUsers(): Promise<ManagedUser[]> {
  return apiGet("/admin/users", () => [])
}

export const createUser = (p: Input<ManagedUser> & { password?: string }) =>
  createEntity<ManagedUser>("users", p)
export const updateUser = (
  id: string,
  p: Input<ManagedUser> & { password?: string }
) => updateEntity<ManagedUser>("users", id, p)
export const deleteUser = (id: string) => deleteEntity("users", id)

// ---- Campagnes newsletter ----
export function getCampaigns(): Promise<Campaign[]> {
  return apiGet("/admin/newsletters", () => [])
}

export function getCampaign(id: string): Promise<Campaign> {
  return apiGet(`/admin/newsletters/${id}`, () => {
    throw new Error("Campagne introuvable")
  })
}

export interface CampaignPayload {
  title?: string
  subject: string
  content: string
}

export function createCampaign(payload: CampaignPayload): Promise<Campaign> {
  return apiSend<Campaign, CampaignPayload>(
    "/admin/newsletters",
    payload,
    (b) => ({
      id: `mock-${Math.random().toString(36).slice(2, 10)}`,
      title: b.title ?? b.subject,
      subject: b.subject,
      content: b.content,
      status: "envoye",
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }),
    "POST"
  )
}

export const deleteCampaign = (id: string) => deleteEntity("newsletters", id)
