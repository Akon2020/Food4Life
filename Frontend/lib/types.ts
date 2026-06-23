// Shared domain types — mirror the backend API contract (Express + MySQL).
// Bilingual fields are suffixed Fr / En.

export type Locale = "fr" | "en"

export type ArticleCategory = "impact" | "evenement" | "presse"
export type ArticleStatus = "draft" | "published"

export interface Article {
  id: string
  slug: string
  titleFr: string
  titleEn: string
  excerptFr: string
  excerptEn: string
  bodyFr: string
  bodyEn: string
  coverImageUrl: string
  category: ArticleCategory
  status: ArticleStatus
  publishedAt: string | null
  authorId: string
  createdAt: string
  updatedAt: string
}

export type ProductStatus = "available" | "coming_soon"

export interface Product {
  id: string
  slug: string
  name: string
  taglineFr: string
  taglineEn: string
  descriptionFr: string
  descriptionEn: string
  ingredients: string[]
  benefitsFr: string[]
  benefitsEn: string[]
  targetAudienceFr: string
  targetAudienceEn: string
  imageUrl: string
  gallery: string[]
  availabilityFr: string
  availabilityEn: string
  status: ProductStatus
  order: number
  createdAt: string
}

export type PartnerCategory =
  | "financier"
  | "technique"
  | "formation"
  | "institutionnel"

export interface Partner {
  id: string
  name: string
  logoUrl: string
  descriptionFr: string
  descriptionEn: string
  websiteUrl: string
  category: PartnerCategory
  order: number
}

export interface TeamMember {
  id: string
  name: string
  roleFr: string
  roleEn: string
  bioFr: string
  bioEn: string
  photoUrl: string
  linkedinUrl: string
  order: number
}

export interface Testimonial {
  id: string
  authorName: string
  authorRoleFr: string
  authorRoleEn: string
  quoteFr: string
  quoteEn: string
  photoUrl: string
  order: number
}

export type GalleryCategory = "terrain" | "produits" | "evenements" | "equipe"

export interface GalleryItem {
  id: string
  titleFr: string
  titleEn: string
  imageUrl: string
  category: GalleryCategory
  captionFr: string
  captionEn: string
  type: "image" | "video"
  videoUrl?: string
  order: number
  createdAt: string
}

export type MessageType = "contact" | "partenariat" | "candidature"
export type MessageStatus = "new" | "read" | "archived"

export interface ContactMessage {
  id: string
  type: MessageType
  name: string
  email: string
  phone?: string
  organization?: string
  partnershipType?: string
  position?: string
  message: string
  cvUrl?: string
  status: MessageStatus
  createdAt: string
}

export interface NewsletterSubscriber {
  id: string
  name?: string
  email: string
  locale: Locale
  confirmed: boolean
  createdAt: string
}

export interface SiteSetting {
  impact: {
    tonnesProduced: number
    householdsServed: number
    farmersSupported: number
    jobsCreated: number
  }
  contact: {
    address: string
    phone: string
    email: string
    mapUrl: string
  }
  socials: {
    facebook: string
    instagram: string
    linkedin: string
    x: string
    youtube: string
  }
}

// ---- Form payloads ----

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

export interface PartnerPayload {
  name: string
  organization: string
  email: string
  phone: string
  partnershipType: string
  message: string
}

export interface ApplicationPayload {
  name: string
  email: string
  phone: string
  position: string
  message: string
  cvFileName?: string
}

export interface NewsletterPayload {
  email: string
  name?: string
  locale: Locale
}
