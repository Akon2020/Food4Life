import { apiGet } from "./client"
import { mockMessages, mockSubscribers } from "@/lib/mock-data/messages"
import { mockArticles } from "@/lib/mock-data/articles"
import type {
  Article,
  ContactMessage,
  NewsletterSubscriber,
} from "@/lib/types"

// Admin variant: returns ALL articles (drafts + published), newest first.
export function getAdminArticles(): Promise<Article[]> {
  return apiGet("/admin/articles", () =>
    [...mockArticles].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )
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
