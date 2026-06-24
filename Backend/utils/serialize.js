// Sérialiseurs : transforment les instances Sequelize en objets bruts conformes
// au contrat du frontend (Frontend/lib/types.ts). Réponses SANS enveloppe (D7).
// Les dates sont renvoyées en ISO (res.json le fait déjà pour les objets Date).

export function serializeArticle(a) {
  if (!a) return null;
  return {
    id: a.id,
    slug: a.slug,
    titleFr: a.titleFr,
    titleEn: a.titleEn,
    excerptFr: a.excerptFr ?? "",
    excerptEn: a.excerptEn ?? "",
    bodyFr: a.bodyFr ?? "",
    bodyEn: a.bodyEn ?? "",
    coverImageUrl: a.coverImageUrl ?? "",
    category: a.category,
    status: a.status,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    authorId: a.authorId ?? "",
    createdAt: a.createdAt ? a.createdAt.toISOString() : null,
    updatedAt: a.updatedAt ? a.updatedAt.toISOString() : null,
  };
}

export function serializeProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    taglineFr: p.taglineFr ?? "",
    taglineEn: p.taglineEn ?? "",
    descriptionFr: p.descriptionFr ?? "",
    descriptionEn: p.descriptionEn ?? "",
    ingredients: p.ingredients ?? [],
    benefitsFr: p.benefitsFr ?? [],
    benefitsEn: p.benefitsEn ?? [],
    targetAudienceFr: p.targetAudienceFr ?? "",
    targetAudienceEn: p.targetAudienceEn ?? "",
    imageUrl: p.imageUrl ?? "",
    gallery: p.gallery ?? [],
    availabilityFr: p.availabilityFr ?? "",
    availabilityEn: p.availabilityEn ?? "",
    status: p.status,
    order: p.order,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
  };
}

export function serializePartner(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    logoUrl: p.logoUrl ?? "",
    descriptionFr: p.descriptionFr ?? "",
    descriptionEn: p.descriptionEn ?? "",
    websiteUrl: p.websiteUrl ?? "",
    category: p.category,
    order: p.order,
  };
}

export function serializeTeamMember(m) {
  if (!m) return null;
  return {
    id: m.id,
    name: m.name,
    roleFr: m.roleFr ?? "",
    roleEn: m.roleEn ?? "",
    bioFr: m.bioFr ?? "",
    bioEn: m.bioEn ?? "",
    photoUrl: m.photoUrl ?? "",
    linkedinUrl: m.linkedinUrl ?? "",
    order: m.order,
  };
}

export function serializeTestimonial(t) {
  if (!t) return null;
  return {
    id: t.id,
    authorName: t.authorName,
    authorRoleFr: t.authorRoleFr ?? "",
    authorRoleEn: t.authorRoleEn ?? "",
    quoteFr: t.quoteFr ?? "",
    quoteEn: t.quoteEn ?? "",
    photoUrl: t.photoUrl ?? "",
    order: t.order,
  };
}

export function serializeGalleryItem(g) {
  if (!g) return null;
  return {
    id: g.id,
    titleFr: g.titleFr ?? "",
    titleEn: g.titleEn ?? "",
    imageUrl: g.imageUrl,
    category: g.category,
    captionFr: g.captionFr ?? "",
    captionEn: g.captionEn ?? "",
    type: g.type,
    videoUrl: g.videoUrl ?? undefined,
    order: g.order,
    createdAt: g.createdAt ? g.createdAt.toISOString() : null,
  };
}

export function serializeSettings(s) {
  if (!s) return null;
  return {
    impact: s.impact,
    contact: s.contact,
    socials: s.socials,
  };
}

export function serializeMessage(m) {
  if (!m) return null;
  return {
    id: m.id,
    type: m.type,
    name: m.name,
    email: m.email,
    phone: m.phone ?? undefined,
    organization: m.organization ?? undefined,
    partnershipType: m.partnershipType ?? undefined,
    position: m.position ?? undefined,
    subject: m.subject ?? undefined,
    message: m.message,
    cvUrl: m.cvUrl ?? undefined,
    status: m.status,
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  };
}

export function serializeSubscriber(a) {
  if (!a) return null;
  return {
    id: a.idAbonne,
    name: a.nomComplet ?? undefined,
    email: a.email,
    locale: a.locale,
    confirmed: a.confirmed,
    createdAt: a.dateAbonnement ? a.dateAbonnement.toISOString() : null,
  };
}
